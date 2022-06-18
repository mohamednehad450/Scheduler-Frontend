import { showNotification } from "@mantine/notifications"
import { channel } from "diagnostics_channel"
import EventEmitter from "events"
import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Pin, SequenceData } from "../../../api"

enum ACTIONS {
    RUN = "run",
    STOP = 'stop',
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
    REFRESH = "refresh"
}

type SequenceActions = {
    [key in (ACTIONS.RUN | ACTIONS.STOP | ACTIONS.ACTIVATE | ACTIONS.DEACTIVATE)]: (id: SequenceData['id']) => void
}

type PinStatus = {
    pin: Pin,
    running: boolean,
    err: Error | null | undefined,
    reservedBy?: SequenceData['id']
}

type State = {
    runningSequences: SequenceData['id'][]
    activeSequences: SequenceData['id'][]
    pins: PinStatus[],
}

type ErrorObject = {
    action: ACTIONS,
    message: string,
    errName: string
    args: any[]
}
type SuccessObject = {
    action: ACTIONS,
    message?: string,
    args: any[]
}


interface ActionsContext extends SequenceActions {
    [ACTIONS.REFRESH]: () => void
    state: State
    emitter?: EventEmitter
}


const actionsContext = createContext<ActionsContext | undefined>(undefined)

const useActions = () => useContext(actionsContext)

const ioUrl = 'http://localhost:8000/'

const initActionsContext = (): ActionsContext => {

    const [socket, setSocket] = useState<Socket>()
    const [state, setState] = useState<State>({ runningSequences: [], activeSequences: [], pins: [] })
    const [emitter, setEmitter] = useState<EventEmitter>()

    useEffect(() => {
        const s = io(ioUrl)
        s.on('connect', () => {
            if (!socket) {
                setSocket(s)
            }
            const e = emitter || new EventEmitter()
            if (!emitter) {
                setEmitter(e)
            }
            s.on('state', (s: Partial<State>) => {
                setState(old => ({ ...old, ...s }))
            })
            s.on('error', (err: ErrorObject) => {
                e.emit('error', err)
            })
            s.on('success', (s: SuccessObject) => {
                e.emit('success', s)
            })
            s.on('pinChange', (channel: number, running: boolean, reservedBy?: SequenceData['id']) => {
                setState(s => ({
                    ...s,
                    pins: s.pins.map(p => p.pin.channel === channel ? {
                        ...p,
                        running,
                        reservedBy,

                    } : p)
                }))
            })
            s.on('stop', (id: string,) => e.emit('stop', id))
            s.on('run', (id: string, date: string, duration: number) => e.emit('run', id, new Date(date), duration))

        })

        return () => {
            s.close()
            setSocket(undefined)
            emitter?.removeAllListeners()
            setEmitter(undefined)
        }
    }, [])


    const run = (id: SequenceData['id']) => socket?.emit(ACTIONS.RUN, id)
    const stop = (id: SequenceData['id']) => socket?.emit(ACTIONS.STOP, id)
    const activate = (id: SequenceData['id']) => socket?.emit(ACTIONS.ACTIVATE, id)
    const deactivate = (id: SequenceData['id']) => socket?.emit(ACTIONS.DEACTIVATE, id)
    const refresh = () => socket?.emit(ACTIONS.REFRESH)


    return {
        run,
        stop,
        activate,
        deactivate,
        refresh,
        state,
        emitter,
    }
}

export { useActions, initActionsContext, actionsContext }
export type { State, ACTIONS, ErrorObject, SuccessObject }
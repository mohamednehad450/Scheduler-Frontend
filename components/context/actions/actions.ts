import EventEmitter from "events"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import type { PinDbType, SequenceDBType } from "../../../Scheduler/src/db"
import os from 'os'

enum ACTIONS {
    RUN = "run",
    STOP = 'stop',
    REFRESH = "refresh"
}

type SequenceActions = {
    [key in (ACTIONS.RUN | ACTIONS.STOP)]: (id: SequenceDBType['id']) => void
}


type State = {
    runningSequences: SequenceDBType['id'][]
    runningChannel: PinDbType['channel'][],
    reservedPins: { pin: PinDbType, sequenceId: SequenceDBType['id'] }[]
    deviceTime: Date | null
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


const useActionsContext = (): ActionsContext => {

    const [socket, setSocket] = useState<Socket>()
    const [state, setState] = useState<State>({ runningSequences: [], runningChannel: [], reservedPins: [], deviceTime: null })
    const [emitter, setEmitter] = useState<EventEmitter>()

    useEffect(() => {
        const s = io(`http://${os.hostname()}:8000`)
        s.on('connect', () => {
            if (!socket) {
                setSocket(s)
            }

            const e = emitter || new EventEmitter()
            setEmitter(e)

            s.on('state', (s: Partial<State>) => {
                setState(old => ({ ...old, ...s }))
            })

            s.on('error', (err: ErrorObject) => {
                e.emit('error', err)
            })

            s.on('success', (s: SuccessObject) => {
                e.emit('success', s)
            })

            s.on('channelChange', (channel: number, running: boolean) => {
                setState(s => {
                    const set = new Set(s.runningChannel)
                    running ? set.add(channel) : set.delete(channel)
                    return {
                        ...s,
                        runningChannel: [...set]
                    }
                }
                )
            })
            s.on('stop', (id: string,) => e.emit('stop', id))
            s.on('run', (id: string, date: string, duration: number) => e.emit('run', id, new Date(date), duration))
            s.on('tick', (date) => setState(s => ({ ...s, deviceTime: new Date(date) })))

        })

        return () => {
            s.close()
            s.removeAllListeners()
            setSocket(undefined)
            emitter?.removeAllListeners()
            setEmitter(undefined)
        }
    }, [])


    const run = useCallback((id: SequenceDBType['id']) => socket?.emit(ACTIONS.RUN, id), [socket])
    const stop = useCallback((id: SequenceDBType['id']) => socket?.emit(ACTIONS.STOP, id), [socket])
    const refresh = useCallback(() => socket?.emit(ACTIONS.REFRESH), [socket])


    return {
        run,
        stop,
        refresh,
        state,
        emitter,
    }
}

export { useActions, useActionsContext, actionsContext }
export type { State, ACTIONS, ErrorObject, SuccessObject }
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

type State = {
    runningSequences: SequenceData['id'][]
    activeSequences: SequenceData['id'][]
    pins: { p: Pin, running: boolean, err: Error | null | undefined }[],
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
}


const actionsContext = createContext<ActionsContext | undefined>(undefined)

const useActions = () => useContext(actionsContext)

const ioUrl = 'http://localhost:3000/'

const initActionsContext = (eventEmitter?: EventEmitter): ActionsContext => {

    const [socket, setSocket] = useState<Socket>()
    const [state, setState] = useState<State>({ runningSequences: [], activeSequences: [], pins: [] })

    useEffect(() => {
        const s = io(ioUrl)
        s.on('connect', () => {
            if (!socket) {
                setSocket(s)
            }
            s.on('state', (s: Partial<State>) => {
                setState(old => ({ ...old, ...s }))
            })
            s.on('error', (err: ErrorObject) => {
                eventEmitter?.emit('error', err)
            })
            s.on('success', (s: SuccessObject) => {
                eventEmitter?.emit('success', s)
            })
        })

        return () => {
            s.close()
            setSocket(undefined)
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
        state
    }
}

export { useActions, initActionsContext, actionsContext }
export type { State, ACTIONS, ErrorObject, SuccessObject }
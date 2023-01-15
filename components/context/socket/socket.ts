import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import type { Pin, Sequence } from "../../../components/common"
import os from 'os'
import { useAuth } from "../auth"
import { BACKEND_BASE_URL } from "../../../api"

enum ACTIONS {
    RUN = "run",
    STOP = 'stop',
    REFRESH = "refresh"
}

type DeviceState = {
    runningSequences: Sequence['id'][]
    channelsStatus: { [key: Pin['channel']]: boolean },
    reservedPins: { pin: Pin, sequenceId: Sequence['id'] }[]
}

type DeviceStateHandler = (state: Partial<DeviceState>) => void
type ChannelChangeHandler = (change: DeviceState['channelsStatus']) => void
type TickHandler = (dateString: string) => void

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


const socketContext = createContext<Socket | undefined>(undefined)

const useSocket = () => useContext(socketContext)


const useSocketContext = (): Socket | undefined => {

    const [socket, setSocket] = useState<Socket>()
    const auth = useAuth()
    useEffect(() => {
        if (auth?.state !== "signedIn") return
        const s = io(BACKEND_BASE_URL, { auth: { token: auth?.token }, })
        s.on('connect', () => {
            setSocket(s)
        })
        s.on('disconnect', () => setSocket(undefined))

        return () => {
            s.close()
            s.removeAllListeners()
            setSocket(undefined)
        }
    }, [auth?.token, auth?.state])


    return socket
}

export { useSocket, useSocketContext, socketContext }
export type { DeviceState, DeviceStateHandler, TickHandler, ChannelChangeHandler, ACTIONS, ErrorObject, SuccessObject }
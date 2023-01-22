import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
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

type SocketContext = {
    url: [string, Dispatch<SetStateAction<string>>]
    socket: Socket | undefined
}


const socketContext = createContext<SocketContext | undefined>(undefined)

const useSocket = () => useContext(socketContext)


const useSocketContext = (): SocketContext => {

    const [socket, setSocket] = useState<Socket>()
    const [socketUrl, setSocketUrl] = useState(`http://${os.hostname()}:8000`)
    const auth = useAuth()
    useEffect(() => {

        if (auth?.state !== "signedIn") return
        const s = io(socketUrl, { auth: { token: auth?.token }, })
        s.on('connect', () => {
            setSocket(s)
        })
        s.on('disconnect', () => setSocket(undefined))

        return () => {
            s.close()
            s.removeAllListeners()
            setSocket(undefined)
        }
    }, [auth?.token, auth?.state, socketUrl])


    return {
        url: [socketUrl, setSocketUrl],
        socket
    }
}

export { useSocket, useSocketContext, socketContext }
export type { DeviceState, DeviceStateHandler, TickHandler, ChannelChangeHandler, ACTIONS, ErrorObject, SuccessObject }
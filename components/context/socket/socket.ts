import { createContext, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import type { PinDbType, SequenceDBType } from "../../../Scheduler/src/db"
import os from 'os'
import { useAuth } from "../auth"

enum ACTIONS {
    RUN = "run",
    STOP = 'stop',
    REFRESH = "refresh"
}

type DeviceState = {
    runningSequences: SequenceDBType['id'][]
    channelsStatus: { [key: PinDbType['channel']]: boolean },
    reservedPins: { pin: PinDbType, sequenceId: SequenceDBType['id'] }[]
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
        const s = io(`http://${os.hostname()}:8000`, { auth: { token: auth?.token }, })
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
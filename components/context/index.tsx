import { FC, PropsWithChildren } from "react";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler, ChannelChangeHandler, } from './socket'


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvideSocket>
            {children}
        </ProvideSocket>
    )
}

export {
    AppContext,
    useSocket,
}

export type {
    DeviceState,
    DeviceStateHandler,
    TickHandler,
    ChannelChangeHandler,
}
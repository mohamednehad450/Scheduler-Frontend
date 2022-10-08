import { FC, PropsWithChildren } from "react";
import { ProvidePrompt, usePrompt } from "./prompt";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler, ChannelChangeHandler, } from './socket'


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvidePrompt>
            <ProvideSocket>
                {children}
            </ProvideSocket>
        </ProvidePrompt>
    )
}

export {
    AppContext,
    useSocket,
    usePrompt,
}

export type {
    DeviceState,
    DeviceStateHandler,
    TickHandler,
    ChannelChangeHandler,
}
import { FC, PropsWithChildren } from "react";
import { ProvideAuth, useAuth } from "./auth";
import { ProvideCRUD, useCRUD } from "./CRUD";
import { ProvidePrompt, usePrompt } from "./prompt";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler, ChannelChangeHandler, } from './socket'


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvideAuth>
            <ProvideCRUD>
                <ProvidePrompt>
                    <ProvideSocket>
                        {children}
                    </ProvideSocket>
                </ProvidePrompt>
            </ProvideCRUD>
        </ProvideAuth>
    )
}

export {
    AppContext,
    useSocket,
    usePrompt,
    useAuth,
    useCRUD,
}
export type {
    DeviceState,
    DeviceStateHandler,
    TickHandler,
    ChannelChangeHandler,
}
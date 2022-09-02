import { FC, PropsWithChildren } from "react";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler } from './socket'
import { ProvidePins, usePins } from "./pins";
import { ProvideCron, useCron } from "./cron";
import { ProvideSequence, useSequence } from "./sequences";


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvideSequence>
            <ProvideCron>
                <ProvideSocket>
                    <ProvidePins>
                        {children}
                    </ProvidePins>
                </ProvideSocket>
            </ProvideCron>
        </ProvideSequence>
    )
}

export {
    AppContext,
    useSocket,
    usePins,
    useSequence,
    useCron,
}

export type {
    DeviceState,
    DeviceStateHandler,
    TickHandler,
}
import { FC, PropsWithChildren } from "react";
import { ProvideActions, useActions } from "./actions";
import { ProvidePins, usePins } from "./pins";
import { ProvideSchedule, useSchedule } from "./schedule";
import { ProvideSequence, useSequence } from "./sequences";


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvideSequence>
            <ProvideSchedule>
                <ProvideActions>
                    <ProvidePins>
                        {children}
                    </ProvidePins>
                </ProvideActions>
            </ProvideSchedule>
        </ProvideSequence>
    )
}

export {
    AppContext,
    useActions,
    usePins,
    useSequence,
    useSchedule
}
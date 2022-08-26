import { FC, PropsWithChildren } from "react";
import { ProvideActions, useActions } from "./actions";
import { ProvidePins, usePins } from "./pins";
import { ProvideCron, useCron } from "./cron";
import { ProvideSequence, useSequence } from "./sequences";


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    return (
        <ProvideSequence>
            <ProvideCron>
                <ProvideActions>
                    <ProvidePins>
                        {children}
                    </ProvidePins>
                </ProvideActions>
            </ProvideCron>
        </ProvideSequence>
    )
}

export {
    AppContext,
    useActions,
    usePins,
    useSequence,
    useCron,
}
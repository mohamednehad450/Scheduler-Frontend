import { MantineProvider } from "@mantine/core";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { ProvideAuth, useAuth } from "./auth";
import { ProvideCRUD, useCRUD } from "./CRUD";
import { ProvidePrompt, usePrompt } from "./prompt";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler, ChannelChangeHandler, } from './socket'


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    const { t } = useTranslation()

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                /** Put your mantine theme override here */
                dir: t('dir') === "rtl" ? 'rtl' : 'ltr',
                colorScheme: 'light',
            }}
        >
            <ProvideAuth>
                <ProvideCRUD>
                    <ProvidePrompt>
                        <ProvideSocket>
                            {children}
                        </ProvideSocket>
                    </ProvidePrompt>
                </ProvideCRUD>
            </ProvideAuth>
        </MantineProvider>
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
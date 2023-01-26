import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { FC, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { ProvideAuth, useAuth } from "./auth";
import { ProvideCRUD, useCRUD } from "./CRUD";
import { ProvidePrompt, usePrompt } from "./prompt";
import { ProvideSocket, useSocket, TickHandler, DeviceState, DeviceStateHandler, ChannelChangeHandler, } from './socket'


const AppContext: FC<PropsWithChildren<{}>> = ({ children }) => {

    const { t } = useTranslation()

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));


    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    dir: t('dir') === "rtl" ? 'rtl' : 'ltr',
                    colorScheme,
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
        </ColorSchemeProvider>
    );
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
import { AppShell, MantineProvider, useMantineTheme } from "@mantine/core"
import { FC, PropsWithChildren, useState } from "react";
import Nav from "./Nav";
import Header from "./Header";



const AppLayout: FC<PropsWithChildren<{}>> = ({ children }) => {

    const theme = useMantineTheme()
    const [opened, setOpened] = useState(false)

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                /** Put your mantine theme override here */
                colorScheme: 'light',
            }}
        >
            <AppShell
                styles={{
                    main: {
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    },
                }}
                navbarOffsetBreakpoint="sm"
                fixed
                navbar={<Nav opened={opened} setOpened={setOpened} />}
                header={<Header opened={opened} setOpened={setOpened} />}
                padding={0}
            >
                {children}
            </AppShell>
        </MantineProvider>
    )
}


export default AppLayout;
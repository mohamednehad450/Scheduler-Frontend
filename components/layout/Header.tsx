import { Dispatch, FC, SetStateAction } from "react";
import { Burger, Button, Group, Header as _Header, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import { useAuth } from "../context";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import SocketUrlMenu from "./SocketUrlMenu";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}


const Header: FC<HeaderProps> = ({ opened, setOpened }) => {
    const auth = useAuth()
    const theme = useMantineTheme()
    const { t } = useTranslation()

    return (
        <_Header height={64} px="md">
            <Group position="apart" align={"center"} style={{ height: '100%' }}>
                <Group>
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="sm"
                            color={theme.colors.gray[6]}
                        />
                    </MediaQuery>
                    <Text size="lg">{t('scheduler')}</Text>
                </Group>
                <Group>
                    <SocketUrlMenu />
                    {auth?.state === "signedIn" && (
                        <Group>
                            <Text>{auth?.username}</Text>
                            <Button variant="subtle" onClick={() => auth?.logout()}>
                                {t('logout')}
                            </Button>
                        </Group>
                    )}
                    <LanguageMenu />
                    <ThemeToggle />
                </Group>
            </Group>
        </_Header>
    )
}


export default Header
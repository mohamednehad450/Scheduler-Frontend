import { Dispatch, FC, SetStateAction } from "react";
import { ActionIcon, Burger, Button, Divider, Group, Header as _Header, MediaQuery, Menu, MenuItem, MenuLabel, Text, useMantineTheme } from "@mantine/core";
import { useAuth } from "../context";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import SocketUrlMenu from "./SocketUrlMenu";
import ThemeToggle from "./ThemeToggle";
import { useMediaQuery } from "@mantine/hooks";
import { Logout, Settings } from "tabler-icons-react";

interface HeaderProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}


const Header: FC<HeaderProps> = ({ opened, setOpened }) => {
    const auth = useAuth()
    const theme = useMantineTheme()
    const { t } = useTranslation()
    const expandSettings = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`, false)

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
                    {expandSettings ?
                        <>
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
                        </>
                        :
                        <Menu
                            control={
                                <ActionIcon>
                                    <Settings />
                                </ActionIcon>
                            }
                        >
                            <LanguageMenu subMenu />
                            <Divider />
                            <SocketUrlMenu subMenu />
                            <Divider />
                            {auth?.state === "signedIn" && (
                                <>
                                    <MenuLabel>{t("account")}</MenuLabel>
                                    <MenuItem icon={<Logout />} onClick={() => auth?.logout()} >
                                        {t('logout')}
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    }
                    <ThemeToggle />
                </Group>
            </Group>
        </_Header>
    )
}


export default Header
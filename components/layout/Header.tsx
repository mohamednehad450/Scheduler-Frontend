import { Dispatch, FC, SetStateAction } from "react";
import { Burger, Button, Group, Header as _Header, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import { useAuth } from "../context";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";

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
                    <LanguageMenu />
                    {auth?.state === "signedIn" && (
                        <Group>
                            <Text>{auth?.username}</Text>
                            <Button variant="subtle" onClick={() => auth?.logout()}>
                                {t('logout')}
                            </Button>
                        </Group>
                    )}
                </Group>
            </Group>
        </_Header>
    )
}


export default Header
import { Dispatch, FC, SetStateAction } from "react";
import { Burger, Button, Group, Header as _Header, MediaQuery, Text, useMantineTheme } from "@mantine/core";
import { useAuth } from "../context";

interface HeaderProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}


const Header: FC<HeaderProps> = ({ opened, setOpened }) => {
    const auth = useAuth()
    const theme = useMantineTheme()
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
                    <Text size="lg">Scheduler</Text>
                </Group>
                {auth?.state === "signedIn" && (
                    <Group>
                        <Text>{auth?.username}</Text>
                        <Button variant="subtle" onClick={() => auth?.logout()}>
                            Logout
                        </Button>
                    </Group>
                )}
            </Group>
        </_Header>
    )
}


export default Header
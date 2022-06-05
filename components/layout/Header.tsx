import { Dispatch, FC, SetStateAction } from "react";
import { Burger, Header as _Header, MediaQuery, Text, useMantineTheme } from "@mantine/core";

interface HeaderProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}


const Header: FC<HeaderProps> = ({ opened, setOpened }) => {
    const theme = useMantineTheme()
    return (
        <_Header height={50} p="md">
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="xl"
                    />
                </MediaQuery>
                <Text>Scheduler</Text>
            </div>
        </_Header>
    )
}


export default Header
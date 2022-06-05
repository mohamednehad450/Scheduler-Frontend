import { Navbar } from "@mantine/core"
import { Dispatch, FC, SetStateAction } from "react"
import { Dashboard } from 'tabler-icons-react';
import NavButton from "./NavButton";



interface NavProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

const Nav: FC<NavProps> = ({ opened, setOpened }) => {
    const close = () => setOpened(false)
    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <NavButton href="/" onClick={close} icon={<Dashboard size={20} />} color="blue" label='Dashboard' />
        </Navbar>
    )
}

export default Nav
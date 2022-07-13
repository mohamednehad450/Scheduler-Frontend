import { Navbar } from "@mantine/core"
import { Dispatch, FC, SetStateAction } from "react"
import { Dashboard, ClipboardList } from 'tabler-icons-react';
import NavButton from "./NavButton";



interface NavProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

const Nav: FC<NavProps> = ({ opened, setOpened }) => {
    const close = () => setTimeout(() => setOpened(false))
    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <NavButton href="/" onClick={close} icon={<Dashboard size={20} />} color="blue" label='Dashboard' />
            <NavButton href="/sequences" onClick={close} icon={<ClipboardList size={20} />} color="teal" label='Sequences' />
        </Navbar>
    )
}

export default Nav
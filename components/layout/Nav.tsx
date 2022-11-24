import { Navbar, useMantineTheme } from "@mantine/core"
import { Dispatch, FC, SetStateAction } from "react"
import { useTranslation } from "react-i18next";
import { Dashboard, ClipboardList, DeviceDesktopAnalytics } from 'tabler-icons-react';
import NavButton from "./NavButton";



interface NavProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

const Nav: FC<NavProps> = ({ opened, setOpened }) => {
    const close = () => setTimeout(() => setOpened(false))
    const theme = useMantineTheme()

    const { t } = useTranslation()


    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
            <NavButton href="/" onClick={close} icon={<Dashboard size={20} />} color="blue" label={t('dashboard')} />
            <NavButton href="/sequences" onClick={close} icon={<ClipboardList size={20} />} color="teal" label={t('sequences')} />
            <NavButton href="/device" onClick={close} icon={<DeviceDesktopAnalytics size={20} />} color="red" label={t('device')} />
        </Navbar>
    )
}

export default Nav
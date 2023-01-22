import { FC, useState } from "react";
import { ActionIcon, Button, Group, Menu, MenuItem, MenuLabel, Modal, TextInput, useMantineTheme } from "@mantine/core";
import { useSocket } from "../context";
import { useTranslation } from "react-i18next";
import { Circle, DevicesPc } from "tabler-icons-react";

const SocketUrlMenu: FC<{}> = () => {

    const theme = useMantineTheme()
    const { t } = useTranslation()
    const sContext = useSocket()
    const [opened, setOpened] = useState(false)
    const [sUrl, setSUrl] = useState(sContext?.url[0] || '')
    const connected = !!sContext?.socket
    return (
        <>
            <Menu
                control={
                    <ActionIcon title={connected ? t("connected") : t("disconnected")} contextMenu="socket">
                        <Circle size={24} fill={connected ? theme.colors.green[7] : theme.colors.red[7]} stroke='0' />
                    </ActionIcon>
                }
            >
                <MenuLabel > {connected ? t("connected") : t("disconnected")} </MenuLabel>
                <MenuItem
                    icon={<DevicesPc />}
                    onClick={() => {
                        setSUrl(sContext?.url[0] || '')
                        setOpened(true)
                    }}
                >
                    {t("change-socket-url")}
                </MenuItem>
            </Menu>
            <Modal title={t("change-socket-url")} opened={opened} onClose={() => setOpened(false)}>
                <form>
                    <TextInput value={sUrl} onChange={s => setSUrl(s.target.value)} />
                    <Group py={'md'} position="right">
                        <Button variant="subtle" onClick={() => setOpened(false)}>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                sContext?.url[1](sUrl)
                                setOpened(false)
                            }}
                        >
                            {t("submit")}
                        </Button>
                    </Group>
                </form>
            </Modal>
        </>
    )
}

export default SocketUrlMenu
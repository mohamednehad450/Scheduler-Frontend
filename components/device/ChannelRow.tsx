import { Menu, MenuItem, useMantineTheme } from "@mantine/core";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Circle, Edit, Trash } from "tabler-icons-react";
import { Pin } from "../common";
import { usePrompt } from "../context";

interface ChannelRowProps {
    pin: Pin
    isRunning: boolean
    remove: (id: Pin['channel']) => void
    onChange: (pin: Pin) => void
}


const ChannelRow: FC<ChannelRowProps> = ({ pin, isRunning, remove, onChange }) => {

    const theme = useMantineTheme()
    const prompt = usePrompt()
    const { t } = useTranslation()

    return (
        <>
            <tr>
                <td style={{ textAlign: 'start' }} >{pin.label}</td>
                <td>{pin.channel}</td>
                <td>{t(pin.onState)}</td>
                <td><Circle size={16} fill={isRunning ? theme.colors.green[7] : theme.colors.red[7]} stroke='0' /></td>
                <td>
                    <Menu>
                        <MenuItem
                            onClick={() => prompt?.newPin((newPin) => newPin && onChange(newPin), {}, pin)}
                            icon={<Edit size={16} />}
                        >
                            {t("edit")}
                        </MenuItem>
                        <MenuItem
                            onClick={() => remove(pin.channel)}
                            color={'red'}
                            icon={<Trash size={16} />}
                        >
                            {t("delete")}
                        </MenuItem>
                    </Menu>
                </td>
            </tr>
        </>
    )
}


export default ChannelRow
import { Menu, MenuItem, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useState } from "react";
import { Circle, Edit, Trash } from "tabler-icons-react";
import { PinDbType } from "../../Scheduler/src/db";
import NewPin from "./NewPin";

interface ChannelRowProps {
    pin: PinDbType
    isRunning: boolean
    remove: (id: PinDbType['channel']) => void
    onChange: (pin: PinDbType) => void
}


const ChannelRow: FC<ChannelRowProps> = ({ pin, isRunning, remove, onChange }) => {

    const theme = useMantineTheme()
    const [editPin, setEditPin] = useState(false)
    const [debouncedEditPin] = useDebouncedValue(editPin, 100)


    return (
        <>
            <tr>
                <td style={{ textAlign: 'start' }} >{pin.label}</td>
                <td>{pin.channel}</td>
                <td>{pin.onState}</td>
                <td><Circle size={16} fill={isRunning ? theme.colors.green[7] : theme.colors.red[7]} stroke='0' /></td>
                <td>
                    <Menu>
                        <MenuItem
                            onClick={() => setEditPin(true)}
                            icon={<Edit size={16} />}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => remove(pin.channel)}
                            color={'red'}
                            icon={<Trash size={16} />}
                        >
                            Remove
                        </MenuItem>
                    </Menu>
                </td>
            </tr>
            {editPin && (
                <NewPin
                    opened={debouncedEditPin}
                    onClose={(pin) => {
                        setEditPin(false)
                        pin && onChange(pin)
                    }}
                    usedPins={{}}
                    initialPin={pin}
                />
            )}
        </>
    )
}


export default ChannelRow
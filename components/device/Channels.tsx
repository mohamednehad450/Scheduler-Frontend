import { ActionIcon, Button, Container, Divider, Group, ScrollArea, Table, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useEffect, useState } from "react";
import { Plus, Refresh } from "tabler-icons-react";
import { pinsCRUD } from "../../api";
import { PinDbType } from "../../Scheduler/src/db";
import { ChannelChangeHandler, DeviceState, DeviceStateHandler, useSocket } from "../context";
import ChannelRow from "./ChannelRow";
import NewPin from "./NewPin";


const Channels: FC = () => {

    const [pins, setPins] = useState<PinDbType[]>([])
    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>([])

    const [newPin, setNewPin] = useState(false)
    const [debouncedNewPin] = useDebouncedValue(newPin, 100)
    const socket = useSocket()


    useEffect(() => {
        const handleState: DeviceStateHandler = ({ channelsStatus }) => {
            channelsStatus && setChannelsStatus(channelsStatus)
        }
        const handleChannelChange: ChannelChangeHandler = (change) => setChannelsStatus(old => ({ ...old, ...change }))
        socket?.on('state', handleState)
        socket?.on('channelChange', handleChannelChange)

        socket?.emit('state')
        return () => {
            socket?.removeListener('state', handleState)
            socket?.removeListener('channelChange', handleChannelChange)
        }
    }, [socket])

    useEffect(() => {
        pinsCRUD.list()
            .then(d => setPins(d.data))
    }, [])


    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <Group py="xs" position="apart">
                <Text size='xl'>{"Pins"}</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => pinsCRUD.list().then(d => setPins(d.data))} >
                        <Refresh size={24} />
                    </ActionIcon>
                    <ActionIcon size={24} onClick={() => setNewPin(true)} >
                        <Plus size={24} />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider />
            {pins.length ? (
                <ScrollArea pt="xs" m="0" p="0">
                    <Table striped highlightOnHover style={{
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    }}  >
                        <tbody  >
                            {pins.map((p, i) => (
                                <ChannelRow
                                    key={p.channel}
                                    onChange={(pin) => setPins(pins => {
                                        pins[i] = pin
                                        return [...pins]
                                    })}
                                    pin={p}
                                    remove={(id) =>
                                        pinsCRUD.remove(id)
                                            .then(() => setPins(pins =>
                                                pins.filter(({ channel }) => id !== channel)))
                                            .catch(() => {
                                                // TODO
                                            })
                                    }
                                    isRunning={channelsStatus && channelsStatus[p.channel]}
                                />
                            ))}
                        </tbody>
                        <tfoot style={{ position: 'sticky', bottom: 0, background: 'white' }}>
                            <tr>
                                <th>Label</th>
                                <th>Channel</th>
                                <th>On state</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </tfoot>
                    </Table>
                </ScrollArea>
            ) : (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text>No pins defined</Text>
                    <Button onClick={() => setNewPin(true)} variant="subtle">Define new pins</Button>
                </div>
            )}
            {newPin && (
                <NewPin
                    opened={debouncedNewPin}
                    onClose={() => {
                        setNewPin(false)
                        pinsCRUD.list()
                            .then(d => setPins(d.data))
                            .catch(err => {
                                // TODO
                            })
                    }}
                    usedPins={pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})}
                />
            )}
        </Container>
    )
}


export default Channels
import { ActionIcon, Button, Container, Divider, Group, ScrollArea, Table, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import { pinsCRUD, sequenceCRUD } from "../../api";
import { PinDbType, SequenceDBType } from "../../Scheduler/src/db";
import { ChannelChangeHandler, DeviceState, DeviceStateHandler, useSocket } from "../context";
import ChannelRow from "./ChannelRow";


const Channels: FC = () => {

    const [pins, setPins] = useState<PinDbType[]>([])
    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>([])

    const socket = useSocket()


    useEffect(() => {
        const handleState: DeviceStateHandler = ({ reservedPins, channelsStatus }) => {
            channelsStatus && setChannelsStatus(channelsStatus)
        }
        const handleChannelChange: ChannelChangeHandler = (change) => setChannelsStatus(old => ({ ...old, ...change }))
        socket?.on('state', handleState)
        socket?.on('channelChange', handleChannelChange)

        socket?.emit('refresh')
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
                <ActionIcon size={24} onClick={() => alert('TBI')} >
                    <Plus size={24} />
                </ActionIcon>
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
                    <Button variant="subtle">Define new pins</Button>
                </div>
            )}
        </Container>
    )
}


export default Channels
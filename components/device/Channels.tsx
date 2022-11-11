import { ActionIcon, Button, Container, Divider, Group, ScrollArea, Table, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Plus, Refresh } from "tabler-icons-react";
import { Pin } from "../common";
import { ChannelChangeHandler, DeviceState, DeviceStateHandler, useCRUD, usePrompt, useSocket } from "../context";
import ChannelRow from "./ChannelRow";


const Channels: FC = () => {

    const [pins, setPins] = useState<Pin[]>([])
    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>([])

    const socket = useSocket()
    const prompt = usePrompt()
    const crud = useCRUD()


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
        crud?.pinsCRUD?.list()
            .then(d => setPins(d.data))
    }, [crud])


    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <Group py="xs" position="apart">
                <Text size='xl'>{"Pins"}</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => crud?.pinsCRUD?.list().then(d => setPins(d.data))} >
                        <Refresh size={24} />
                    </ActionIcon>
                    <ActionIcon
                        size={24}
                        onClick={() =>
                            prompt?.newPin(
                                () => crud?.pinsCRUD?.list().then(d => setPins(d.data)),
                                pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
                            )
                        }
                    >
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
                                        crud?.pinsCRUD?.remove(id)
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
                    <Button
                        onClick={() =>
                            prompt?.newPin(
                                () => crud?.pinsCRUD?.list().then(d => setPins(d.data)),
                                pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
                            )
                        }
                        variant="subtle"
                    >
                        Define new pins
                    </Button>
                </div>
            )}
        </Container>
    )
}


export default Channels
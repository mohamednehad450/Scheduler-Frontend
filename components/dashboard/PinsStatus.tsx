import { Button, Card, Group, LoadingOverlay, Tabs, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { pinsCRUD } from "../../api";
import { PinDbType, SequenceDBType } from "../../Scheduler/src/db";
import { DeviceState, DeviceStateHandler, ChannelChangeHandler, useSocket, usePrompt } from "../context";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC<{ sequences: SequenceDBType[] }> = ({ sequences }) => {

    const socket = useSocket()
    const prompt = usePrompt()

    const [pins, setPins] = useState<PinDbType[]>([])
    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>()
    const [reservedPins, setReservedPins] = useState<DeviceState['reservedPins']>()

    useEffect(() => {
        if (!socket) return
        pinsCRUD.list()
            .then(d => setPins(d.data))

        const handleState: DeviceStateHandler = ({ reservedPins, channelsStatus }) => {
            channelsStatus && setChannelsStatus(channelsStatus)
            reservedPins && setReservedPins(reservedPins)
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


    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="All Pins">
                    <ScrollList
                        body={pins.length && pins.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={!!channelsStatus && channelsStatus[s.channel]} />
                        ))}
                        empty={
                            <>
                                <Text>No pins defined</Text>
                                <Button
                                    onClick={() => prompt?.newPin(
                                        () => pinsCRUD.list().then(d => setPins(d.data)),
                                        pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
                                    )}
                                    variant="subtle"
                                >
                                    Add new pin
                                </Button>
                            </>
                        }
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>Pin</Text>
                                <Text weight={'bold'} >Status</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
                <Tabs.Tab label="Reserved Pins">
                    <ScrollList
                        body={reservedPins?.length && reservedPins.map((s) => (
                            <Group key={s.pin.channel} p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.pin.label}</Text>
                                <Text size="sm">{sequences.find(seq => s.sequenceId === seq.id)?.name || "NULL"}</Text>
                            </Group>
                        ))}
                        empty={<Text>No reserved pins</Text>}
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>Pin</Text>
                                <Text weight={'bold'} >Sequence</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
            </Tabs>
            <LoadingOverlay visible={!socket || !channelsStatus || !reservedPins} />
        </Card>
    )
}

export default PinsStatus
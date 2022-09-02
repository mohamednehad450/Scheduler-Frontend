import { Card, Group, LoadingOverlay, Tabs, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { PinDbType, SequenceDBType } from "../../Scheduler/src/db";
import { DeviceState, DeviceStateHandler, ChannelChangeHandler, useSocket } from "../context";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC<{ pins: PinDbType[], sequences: SequenceDBType[] }> = ({ pins, sequences }) => {

    const socket = useSocket()


    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>()
    const [reservedPins, setReservedPins] = useState<DeviceState['reservedPins']>()

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ reservedPins, channelsStatus }) => {
            channelsStatus && setChannelsStatus(channelsStatus)
            reservedPins && setReservedPins(reservedPins)
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

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="All Pins">
                    <ScrollList
                        body={pins.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={!!channelsStatus && channelsStatus[s.channel]} />
                        ))}
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
                        body={reservedPins?.map((s) => (
                            <Group key={s.pin.channel} p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.pin.label}</Text>
                                <Text size="sm">{sequences.find(seq => s.sequenceId === seq.id)?.name || "NULL"}</Text>
                            </Group>
                        ))}
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
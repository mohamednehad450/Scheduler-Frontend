import { Card, Group, LoadingOverlay, Tabs, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import { usePins } from "../context/pins";
import { useSequence } from "../context/sequences";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC = () => {

    const socket = useSocket()
    const seq = useSequence()
    const pins = usePins()


    const [runningChannel, setRunningChannel] = useState<DeviceState['runningChannel']>()
    const [reservedPins, setReservedPins] = useState<DeviceState['reservedPins']>()

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ reservedPins, runningChannel }) => {
            runningChannel && setRunningChannel(runningChannel)
            reservedPins && setReservedPins(reservedPins)
        }
        socket?.on('state', handleState)
        socket?.emit('refresh')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="All Pins">
                    <ScrollList
                        body={pins?.list.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={runningChannel?.some(c => c === s.channel) || false} />
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
                                <Text size="sm">{seq?.list.find(seq => s.sequenceId === seq.id)?.name || "NULL"}</Text>
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
            <LoadingOverlay visible={!socket || !runningChannel || !reservedPins} />
        </Card>
    )
}

export default PinsStatus
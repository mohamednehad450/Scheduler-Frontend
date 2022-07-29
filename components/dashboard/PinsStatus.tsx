import { Card, Group, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useActions } from "../context/actions";
import { usePins } from "../context/pins";
import { useSequence } from "../context/sequences";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC = () => {

    const actions = useActions()
    const seq = useSequence()
    const pins = usePins()

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="All Pins">
                    <ScrollList
                        body={pins?.list.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={actions?.state.runningChannel.some(c => c === s.channel) || false} />
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
                        body={actions?.state.reservedPins.map((s) => (
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
        </Card>
    )
}

export default PinsStatus
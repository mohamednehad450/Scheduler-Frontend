import { Card, Group, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { useActions } from "../context/actions";
import { useSequence } from "../context/sequences";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC = () => {

    const actions = useActions()
    const seq = useSequence()

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="All Pins">
                    <ScrollList
                        body={actions?.state.pins.map(s => (
                            <PinStatusRow label={s.pin.label} running={s.running} />
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
                        body={actions?.state.pins.filter(s => s.reservedBy).map((s) => (
                            <Group p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.pin.label}</Text>
                                <Text size="sm">{seq?.list.find(seq => s.reservedBy === seq.id)?.name || "NULL"}</Text>
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
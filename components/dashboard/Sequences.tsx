import { Card, Divider, Group, Tabs, Text, } from "@mantine/core";
import { FC } from "react";
import { useActions } from "../context/actions";
import { useSequence } from "../context/sequences";
import ScrollList from "./ScrollList";


const Sequences: FC = () => {

    const actions = useActions()
    const seq = useSequence()
    const running = seq?.list.filter(s => (actions?.state.runningSequences || []).some(id => id === s.id)) || []
    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="Active Sequences">
                    <ScrollList
                        body={seq?.list.filter(s => s.active).map((s) => (
                            <Group key={s.id} p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.name}</Text>
                                <Text size="sm">{s.schedule?.label}</Text>
                            </Group>
                        ))}
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>Sequence</Text>
                                <Text weight={'bold'} >Schedule</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
                <Tabs.Tab label="Running Sequences">
                    <ScrollList
                        body={running.map((s) => (
                            <Group key={s.id} p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.name}</Text>
                                <Text size="sm">{s.lastRun ? new Date(s.lastRun).toLocaleString() : "Never"}</Text>
                            </Group>
                        ))}
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>Sequence</Text>
                                <Text weight={'bold'} >Ran at</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
            </Tabs>
        </Card>
    )
}

export default Sequences
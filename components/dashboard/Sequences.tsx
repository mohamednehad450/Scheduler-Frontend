import { Card, Divider, Group, Tabs, Text, } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { SequenceDBType } from "../../Scheduler/src/db";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import ScrollList from "./ScrollList";


const Sequences: FC<{ sequences: SequenceDBType[] }> = ({ sequences }) => {

    const socket = useSocket()
    const router = useRouter()

    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    const running = sequences.filter(s => (runningSequences || []).some(id => id === s.id)) || []
    const active = sequences.filter(s => s.active)

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        socket?.on('state', handleState)
        socket?.emit('refresh')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])



    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label="Active Sequences">
                    <ScrollList
                        body={active.length && active.map((s) => (
                            <Group
                                key={s.id}
                                p={'xs'}
                                position="apart"
                                sx={theme => ({
                                    borderBottom: "2px solid #e9ecef",
                                    ':hover': {
                                        backgroundColor: '#f1f3f5',
                                        cursor: 'pointer'
                                    }
                                })}
                                onClick={() => router.push('sequences/' + s.id)}
                            >
                                <Text size="sm">{s.name}</Text>
                                <Text size="sm">{s.CronSequence.length} Triggers</Text>
                            </Group>
                        ))}
                        empty={<Text>No active sequences</Text>}
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>Sequence</Text>
                                <Text weight={'bold'} >Triggers</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
                <Tabs.Tab label="Running Sequences">
                    <ScrollList
                        body={running.length && running.map((s) => (
                            <Group
                                key={s.id}
                                p={'xs'}
                                position="apart"
                                sx={theme => ({
                                    borderBottom: "2px solid #e9ecef",
                                    ':hover': {
                                        backgroundColor: '#f1f3f5',
                                        cursor: 'pointer'
                                    }
                                })}
                                onClick={() => router.push('sequences/' + s.id)}
                            >
                                <Text size="sm">{s.name}</Text>
                                <Text size="sm">{s.lastRun ? new Date(s.lastRun).toLocaleString() : "Never"}</Text>
                            </Group>
                        ))}
                        empty={<Text>No running sequences</Text>}
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
import { Card, Divider, Group, Tabs, Text, } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { DeviceState, DeviceStateHandler, useSocket } from "../context";
import { useSequence } from "../context/sequences";
import ScrollList from "./ScrollList";


const Sequences: FC = () => {

    const socket = useSocket()
    const seq = useSequence()
    const router = useRouter()

    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])
    const running = seq?.list.filter(s => (runningSequences || []).some(id => id === s.id)) || []


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
                        body={seq?.list.filter(s => s.active).map((s) => (
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
                        body={running.map((s) => (
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
import { Button, Container, Divider, Grid, Group, ScrollArea, Text } from "@mantine/core"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { CalendarEvent, CalendarOff, Edit, Link, PlayerPause, PlayerPlay, Trash } from "tabler-icons-react"
import { v4 } from "uuid"
import { LoadingButton, Sequence } from "../common"
import { DeviceState, DeviceStateHandler, usePrompt, useSocket } from "../context"
import { useCRUD } from "../context"


const g = {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6,
    span: 12
}

const g1 = {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 12,
    span: 12
}

const g2 = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 12,
    span: 12
}


interface SequenceActionsProps {
    sequence: Sequence
    onChange: (s: Sequence) => void
}


const SequenceActions: FC<SequenceActionsProps> = ({ sequence, onChange }) => {

    const prompt = usePrompt()
    const socket = useSocket()

    const crud = useCRUD()

    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        socket?.on('state', handleState)
        socket?.emit('state')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])



    const isRunning = runningSequences.some(id => id === sequence.id)
    const router = useRouter()
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">Actions </Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
                <Container>
                    <Grid gutter={'sm'}>
                        <Grid.Col {...g}>
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <LoadingButton p={0} onClick={(onDone) => {
                                    const actionId = v4()
                                    socket?.emit(isRunning ? 'stop' : 'run', actionId, sequence.id)
                                    socket?.once(actionId, (ok: boolean, err: Error | null) => {
                                        onDone()
                                        // TODO: Error handling    
                                    })
                                }}>
                                    <Group>
                                        {isRunning ?
                                            (<PlayerPause size={16} />) :
                                            (<PlayerPlay size={16} />)
                                        }
                                        {isRunning ?
                                            "Stop" :
                                            "Run"
                                        }
                                    </Group>
                                </LoadingButton>
                            </Group>
                        </Grid.Col>
                        <Grid.Col {...g}>
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <LoadingButton p={0} onClick={(onDone) => {
                                    crud?.sequenceCRUD?.update(sequence?.id, { active: !sequence.active })
                                        .then(d => {
                                            onDone()
                                            onChange(d.data)
                                        })
                                        .catch(err => {
                                            // TODO
                                            onDone()
                                        })
                                }}>
                                    <Group>
                                        {sequence.active ?
                                            (<CalendarOff size={16} />) :
                                            (<CalendarEvent size={16} />)
                                        }
                                        {sequence.active ?
                                            "Deactivate" :
                                            "Activate"
                                        }
                                    </Group>
                                </LoadingButton>
                            </Group>
                        </Grid.Col>
                        <Grid.Col {...{ ...g1 }}>
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <Button
                                    p={0}
                                    variant="outline"
                                    onClick={() => prompt?.linkSequence(s => s && onChange(s), sequence.id, sequence.CronSequence.map(c => c.cron.id))}
                                >
                                    <Group>
                                        <Link size={16} />
                                        {"Edit Triggers"}
                                    </Group>
                                </Button>
                            </Group>
                        </Grid.Col>
                        <Grid.Col {...{ ...g1 }}>
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <Button
                                    p={0}
                                    variant={'outline'}
                                    onClick={() => prompt?.newSequence((s) => s && onChange(s), sequence)}
                                >
                                    <Group>
                                        <Edit size={16} />
                                        {"Edit Sequence"}
                                    </Group>
                                </Button>
                            </Group>
                        </Grid.Col>
                        <Grid.Col {...g2}  >
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <Button
                                    p={0}
                                    color={"red"}
                                    onClick={() => {
                                        prompt?.confirm((confirmed) => {
                                            if (!confirmed) {
                                                return
                                            }
                                            crud?.sequenceCRUD?.remove(sequence?.id)
                                                .then(() => router.back())
                                                .catch(err => {
                                                    // TODO
                                                })
                                        })
                                    }}>
                                    <Group>
                                        <Trash size={16} />
                                        {"Delete"}
                                    </Group>
                                </Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Container>
            </ScrollArea>
        </Container>
    )
}

export default SequenceActions

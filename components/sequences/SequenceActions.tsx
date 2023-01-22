import { Button, Container, Divider, Grid, Group, ScrollArea, Text } from "@mantine/core"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
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
    const sContext = useSocket()

    const crud = useCRUD()

    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        sContext?.socket?.on('state', handleState)
        sContext?.socket?.emit('state')
        return () => { sContext?.socket?.removeListener('state', handleState) }
    }, [sContext])



    const isRunning = runningSequences.some(id => id === sequence.id)
    const router = useRouter()
    const { t } = useTranslation()
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">{t('actions')}</Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
                <Container>
                    <Grid gutter={'sm'}>
                        <Grid.Col {...g}>
                            <Group direction="column" style={{ alignItems: 'stretch' }}>
                                <LoadingButton p={0} onClick={(onDone) => {
                                    const actionId = v4()
                                    sContext?.socket?.emit(isRunning ? 'stop' : 'run', actionId, sequence.id)
                                    sContext?.socket?.once(actionId, (ok: boolean, err: Error | null) => {
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
                                            t('stop') :
                                            t('run')
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
                                            t('deactivate') :
                                            t('activate')
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
                                        {t('edit_triggers')}
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
                                        {t('edit_sequence')}
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
                                        {t('delete')}
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

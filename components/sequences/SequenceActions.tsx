import { Container, Grid, Group, ThemeIcon } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { CalendarEvent, CalendarOff, Edit, PlayerPause, PlayerPlay, Trash } from "tabler-icons-react"
import { sequenceCRUD } from "../../api"
import { SequenceDBType } from "../../Scheduler/src/db"
import { DeviceState, DeviceStateHandler, useSocket } from "../context"
import LoadingButton from "./LoadingButton"
import NewSequence from "./NewSequence"


const g = {
    xs: 6,
    sm: 6,
    md: 6,
    lg: 6,
    xl: 6,
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
    sequence: SequenceDBType
    onChange?: (s: SequenceDBType) => void
}


const SequenceActions: FC<SequenceActionsProps> = ({ sequence, onChange }) => {

    const socket = useSocket()
    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        socket?.on('state', handleState)
        socket?.emit('refresh')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])



    const isRunning = runningSequences.some(id => id === sequence.id)
    const router = useRouter()
    return (
        <Container>
            <Grid gutter={'sm'}>
                <Grid.Col {...g}>
                    <Group direction="column" style={{ alignItems: 'stretch' }}>
                        <LoadingButton p={0} disabled={isRunning} onClick={(onDone) => {
                            socket?.emit('run', sequence.id)
                            socket?.once('run', (id: SequenceDBType['id']) => {
                                if (id === sequence.id) {
                                    onDone()
                                }
                            })
                        }}>
                            <Group>
                                <PlayerPlay size={16} />
                                {"Run"}
                            </Group>
                        </LoadingButton>
                        <LoadingButton p={0} disabled={!isRunning} onClick={(onDone) => {
                            socket?.emit('stop', sequence.id)
                            socket?.once('stop', (id: SequenceDBType['id']) => {
                                if (id === sequence.id) {
                                    onDone()
                                }
                            })
                        }}>
                            <Group>
                                <PlayerPause size={16} />
                                {' Stop'}
                            </Group>
                        </LoadingButton>
                    </Group>
                </Grid.Col>
                <Grid.Col {...g}>
                    <Group direction="column" style={{ alignItems: 'stretch' }}>
                        <LoadingButton p={0} disabled={sequence.active} onClick={(onDone) => {
                            sequenceCRUD.update(sequence?.id, { active: true })
                                .then(d => {
                                    onDone()
                                    onChange && onChange(d.data)
                                })
                                .catch(err => {
                                    // TODO
                                    onDone()
                                })
                        }}>
                            <Group>
                                <CalendarEvent size={16} />
                                {"Activate"}
                            </Group>
                        </LoadingButton>
                        <LoadingButton p={0} disabled={!sequence.active} onClick={(onDone) => {
                            sequenceCRUD.update(sequence?.id, { active: false })
                                .then(d => {
                                    onDone()
                                    onChange && onChange(d.data)
                                })
                                .catch(err => {
                                    // TODO
                                    onDone()
                                })
                        }}>
                            <Group>
                                <CalendarOff size={16} />
                                {' Deactivate'}
                            </Group>
                        </LoadingButton>
                    </Group>
                </Grid.Col>
                <Grid.Col {...g2}  >
                    <Group direction="column" style={{ alignItems: 'stretch' }}>
                        <LoadingButton p={0} color={"gray"} onClick={(onDone) => {
                            alert('To be implemented')
                            onDone()
                        }}>
                            <Group>
                                <Edit size={16} />
                                {"Edit"}
                            </Group>
                        </LoadingButton>
                        <LoadingButton confirm p={0} color={"red"} onClick={(onDone) => {
                            sequenceCRUD.remove(sequence?.id)
                                .then(() => router.back())
                                .catch(err => {
                                    // TODO
                                    onDone()
                                })
                        }}>
                            <Group>
                                <Trash size={16} />
                                {"Delete"}
                            </Group>
                        </LoadingButton>
                    </Group>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default SequenceActions

import { Container, Grid, Group, ThemeIcon } from "@mantine/core"
import { useRouter } from "next/router"
import { FC } from "react"
import { CalendarEvent, CalendarOff, Edit, PlayerPause, PlayerPlay, Trash } from "tabler-icons-react"
import { SequenceDBType } from "../../Scheduler/src/db"
import { useActions } from "../context/actions"
import { useSequence } from "../context/sequences"
import LoadingButton from "./LoadingButton"


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

    const seq = useSequence()
    const actions = useActions()
    const isRunning = actions?.state.runningSequences.some(id => id === sequence.id)
    const router = useRouter()
    return (
        <Container>
            <Grid gutter={'sm'}>
                <Grid.Col {...g}>
                    <Group direction="column" style={{ alignItems: 'stretch' }}>
                        <LoadingButton p={0} disabled={isRunning} onClick={(onDone) => {
                            actions?.run(sequence.id)
                            actions?.emitter?.once('run', (id: SequenceDBType['id']) => {
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
                            actions?.stop(sequence.id)
                            actions?.emitter?.once('stop', (id: SequenceDBType['id']) => {
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
                            seq?.update(sequence?.id, { active: true },
                                (err, seq) => {
                                    if (!err && seq && onChange) {
                                        onChange(seq)
                                    }
                                    onDone()
                                }
                            )
                        }}>
                            <Group>
                                <CalendarEvent size={16} />
                                {"Activate"}
                            </Group>
                        </LoadingButton>
                        <LoadingButton p={0} disabled={!sequence.active} onClick={(onDone) => {
                            seq?.update(sequence?.id, { active: false },
                                (err, seq) => {
                                    if (!err && seq && onChange) {
                                        onChange(seq)
                                    }
                                    onDone()
                                }
                            )
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
                            seq?.remove(sequence?.id,
                                (err) => {
                                    if (!err) {
                                        router.back()
                                    }
                                    onDone()
                                }
                            )
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

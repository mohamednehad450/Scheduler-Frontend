import { Group, Text, ActionIcon, Tooltip, MediaQuery, Menu } from '@mantine/core'
import { FC, MouseEventHandler } from 'react'
import { Calendar, CalendarOff, Edit, PlayerPause, PlayerPlay, } from 'tabler-icons-react';
import type { SequenceDBType } from '../../Scheduler/src/db'
import { useActions } from '../../components/context/actions'
import { useSequence } from '../context/sequences';
import { useRouter } from 'next/router';

const stopPropagation: (cb?: MouseEventHandler) => MouseEventHandler = (cb) => (e) => {
    e.stopPropagation()
    cb && cb(e)
}
const SequenceRow: FC<{ sequence: SequenceDBType, }> = ({ sequence }) => {

    const actions = useActions()
    const sequences = useSequence()
    const isRunning = (actions?.state.runningSequences || []).some(id => id === sequence.id)
    const router = useRouter()
    const toggleRun = stopPropagation(() => isRunning ? actions?.stop(sequence.id) : actions?.run(sequence.id))
    const toggleActive = stopPropagation(() => sequences?.update(
        sequence.id,
        { active: !sequence.active },
        (err: any) => {
            // TODO
        }
    ))

    return (
        <tr onClick={stopPropagation(() => router.push(router.route + '/' + sequence.id))} >
            <td>
                <Text weight={'bold'}>{sequence.name}</Text>
            </td>
            <td>
                <Text >{sequence.lastRun ? new Date(sequence.lastRun).toLocaleString() : 'Never'}</Text>
            </td>
            <td>
                <Text >{sequence.schedule?.label}</Text>
            </td>
            <td>
                <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                    <Group>
                        <Tooltip label={isRunning ? 'Stop' : "Run"} withArrow>
                            <ActionIcon
                                variant="default"
                                onClick={toggleRun}
                            >
                                {isRunning ?
                                    <PlayerPause size={16} /> :
                                    < PlayerPlay size={16} />
                                }
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={sequence.active ? 'Deactivate' : "Activate"} withArrow>
                            <ActionIcon
                                variant='default'
                                onClick={toggleActive}
                            >
                                {sequence.active ?
                                    <CalendarOff size={16} /> :
                                    <Calendar size={16} />
                                }
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={"Edit"} withArrow>
                            <ActionIcon
                                variant='default'
                                onClick={stopPropagation(() => alert('TO BE IMPLEMENTED'))}
                            >
                                <Edit size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </MediaQuery>
                <MediaQuery largerThan={'md'} styles={{ display: 'none' }} >
                    <Menu onClick={stopPropagation()}>
                        <Menu.Label>Actions</Menu.Label>
                        <Menu.Item
                            onClick={toggleRun}
                            icon={isRunning ?
                                <PlayerPause size={16} /> :
                                < PlayerPlay size={16} />
                            }
                        >
                            {isRunning ? "Stop" : "Run"}
                        </Menu.Item>
                        <Menu.Item
                            onClick={toggleActive}
                            icon={sequence.active ?
                                <CalendarOff size={16} /> :
                                <Calendar size={16} />
                            }
                        >
                            {sequence.active ?
                                "Deactivate" :
                                "Activate"
                            }
                        </Menu.Item>
                        <Menu.Item icon={<Edit size={16} />}>Edit</Menu.Item>
                    </Menu>
                </MediaQuery>
            </td>
        </tr>
    )
}


export default SequenceRow

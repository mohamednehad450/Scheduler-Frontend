import { Group, Text, ActionIcon, Tooltip, MediaQuery, Menu } from '@mantine/core'
import { FC, MouseEventHandler, useState } from 'react'
import { Calendar, CalendarOff, Edit, PlayerPause, PlayerPlay, Trash, } from 'tabler-icons-react';
import type { SequenceDBType } from '../../Scheduler/src/db'
import { useRouter } from 'next/router';
import { sequenceCRUD } from '../../api';
import { useDebouncedValue } from '@mantine/hooks';
import NewSequence from './NewSequence';

const stopPropagation: (cb?: MouseEventHandler) => MouseEventHandler = (cb) => (e) => {
    e.stopPropagation()
    cb && cb(e)
}
const SequenceRow: FC<{
    sequence: SequenceDBType,
    isRunning: boolean,
    run: (id: SequenceDBType['id'], onDone?: () => void) => void
    stop: (id: SequenceDBType['id'], onDone?: () => void) => void
}> = ({ sequence: initSequence, isRunning, run, stop }) => {

    const [sequence, setSequence] = useState(initSequence)
    const [edit, setEdit] = useState(false)
    const [debouncedEdit] = useDebouncedValue(edit, 100)
    const router = useRouter()

    const updateSequence = () => sequenceCRUD.get(sequence.id)
        .then(d => d.data && setSequence(d.data))
        .catch(err => {
            // TODO
        })
    const toggleRun = stopPropagation(() => isRunning ? stop(sequence.id, updateSequence) : run(sequence.id, updateSequence))
    const toggleActive = stopPropagation(() =>
        sequenceCRUD.update(sequence.id, { active: !sequence.active })
            .then(d => d.data && setSequence(d.data))
            .catch(err => {
                // TODO
            })
    )

    return (
        <>
            {edit && (
                <NewSequence
                    onClose={(newSeq) => {
                        setEdit(false)
                        newSeq && setSequence(newSeq)
                    }}
                    opened={debouncedEdit}
                    initialSequence={sequence}
                />
            )}
            <tr onClick={stopPropagation(() => router.push(router.route + '/' + sequence.id))} >
                <td>
                    <Text weight={'bold'}>{sequence.name}</Text>
                </td>
                <td>
                    <Text >{sequence.lastRun ? new Date(sequence.lastRun).toLocaleString() : 'Never'}</Text>
                </td>
                <td>
                    <Text >{sequence.CronSequence.length ? sequence.CronSequence.length + " triggers" : "no triggers"} </Text>
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
                                    onClick={stopPropagation(() => setEdit(true))}
                                >
                                    <Edit size={16} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label={"Delete"} withArrow>
                                <ActionIcon
                                    variant='default'
                                    color={'red'}
                                    onClick={stopPropagation(() => alert('TO BE IMPLEMENTED'))}
                                >
                                    <Trash size={16} />
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
                            <Menu.Item
                                color={"red"}
                                icon={<Trash size={16} />}
                            >
                                Delete
                            </Menu.Item>
                        </Menu>
                    </MediaQuery>
                </td>
            </tr>
        </>
    )
}


export default SequenceRow

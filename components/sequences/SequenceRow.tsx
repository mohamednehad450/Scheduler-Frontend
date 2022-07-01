import { Group, Text, ActionIcon, Tooltip } from '@mantine/core'
import { FC, } from 'react'
import { Calendar, CalendarOff, Edit, PlayerPause, PlayerPlay, } from 'tabler-icons-react';
import { SequenceDBType } from '../../Scheduler/src/db'
import { useActions } from '../../components/context/actions'

const SequenceRow: FC<{ sequence: SequenceDBType, }> = ({ sequence }) => {

    const actions = useActions()
    const isRunning = (actions?.state.runningSequences || []).some(id => id === sequence.id)

    return (
        <tr>
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
                <Group>
                    <Tooltip label={isRunning ? 'Stop' : "Run"} withArrow>
                        <ActionIcon
                            variant="default"
                            onClick={() => isRunning ? actions?.stop(sequence.id) : actions?.run(sequence.id)}
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
                            onClick={() => sequence.active ? actions?.deactivate(sequence.id) : actions?.activate(sequence.id)}
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
                            onClick={() => alert('TO BE IMPLEMENTED')}
                        >
                            <Edit size={16} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </td>
        </tr>
    )



}
export default SequenceRow

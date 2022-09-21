import { Button, Group, Table, Text } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import type { SequenceDBType } from '../../Scheduler/src/db'
import { DeviceState, DeviceStateHandler, useSocket } from '../context'
import SequenceRow from './SequenceRow'
import { v4 } from 'uuid'

interface SequenceListProps {
    sequences: SequenceDBType[]
    onChange: (sequences: SequenceDBType[]) => void
    show: 'running' | 'active' | 'all'
    addNew: () => void
}


const SequenceList: FC<SequenceListProps> = ({ sequences, onChange, show, addNew }) => {

    const socket = useSocket()
    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        socket?.on('state', handleState)
        socket?.emit('state')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])

    const list = sequences.map((s, i) => ({ ...s, i }))?.filter(s => {
        switch (show) {
            case 'all':
                return true
            case 'active':
                return s.active
            case 'running':
                return runningSequences.some(id => id === s.id)
        }
    })

    return (
        <>
            {list.length ? (<Table striped highlightOnHover verticalSpacing={'xs'} horizontalSpacing="sm" sx={theme => ({ ":hover": { cursor: "pointer" } })}>
                <thead style={{ position: 'sticky' }}>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th>
                            Last Run
                        </th>
                        <th>
                            No. of Triggers
                        </th>
                        <th>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody >
                    {list.map(s => <SequenceRow
                        key={String(s.id)}
                        isRunning={runningSequences.some(id => id === s.id)}
                        sequence={s}
                        onChange={(newSeq) => {
                            const newSequences = [...sequences]
                            newSequences[s.i] = newSeq
                            onChange(newSequences)
                        }}
                        run={(id, onDone) => {
                            const actionId = v4()
                            socket?.emit('run', actionId, id)
                            socket?.once(actionId, (ok: boolean, err: Error | null) => {
                                onDone && onDone()
                                // TODO: Error handling    
                            })
                        }}
                        stop={(id, onDone) => {
                            const actionId = v4()
                            socket?.emit('stop', actionId, id)
                            socket?.once(actionId, (ok: boolean, err: Error | null) => {
                                onDone && onDone()
                                // TODO: Error handling    
                            })
                        }}
                    />)}
                </tbody>
            </Table>
            ) :
                <Group style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", placeItems: 'center' }}>
                    {(show === "all" || !sequences.length ? (
                        <Group direction='column' position='center' >
                            <Text>{"No Sequences defined"}</Text>
                            <Button variant='subtle' onClick={addNew}>
                                Add new Sequence
                            </Button>
                        </Group>
                    ) :
                        (<Text>{show === "active" ? "No Active Sequences" : "No Running Sequences"}</Text>))}
                </Group>
            }
        </>
    )
}
export default SequenceList

import { Table } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import type { SequenceDBType } from '../../Scheduler/src/db'
import { DeviceState, DeviceStateHandler, useSocket } from '../context'
import SequenceRow from './SequenceRow'


const SequenceList: FC<{ sequences?: SequenceDBType[], show: 'running' | 'active' | 'all' }> = ({ sequences, show }) => {

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


    return (
        <Table striped highlightOnHover verticalSpacing={'xs'} horizontalSpacing="sm" sx={theme => ({ ":hover": { cursor: "pointer" } })}>
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
                {sequences?.filter(s => {
                    switch (show) {
                        case 'all':
                            return true
                        case 'active':
                            return s.active
                        case 'running':
                            return runningSequences.some(id => id === s.id)
                    }
                }).map(s => <SequenceRow
                    key={String(s.id)}
                    isRunning={runningSequences.some(id => id === s.id)}
                    sequence={s}
                    run={(id) => socket?.emit('run', id)}
                    stop={(id) => socket?.emit('stop', id)}
                />)}
            </tbody>
        </Table>
    )
}
export default SequenceList

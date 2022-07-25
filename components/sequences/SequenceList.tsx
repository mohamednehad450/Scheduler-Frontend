import { Table } from '@mantine/core'
import { FC } from 'react'
import type { SequenceDBType } from '../../Scheduler/src/db'
import SequenceRow from './SequenceRow'


const SequenceList: FC<{ sequences?: SequenceDBType[] }> = ({ sequences }) => {
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
                        Schedule
                    </th>
                    <th>
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody >
                {sequences?.map(s => <SequenceRow key={String(s.id)} sequence={s} />)}
            </tbody>
        </Table>
    )
}
export default SequenceList

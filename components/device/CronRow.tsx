import { Button, Divider, Group, Table, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useState } from "react";
import { Edit, Trash } from "tabler-icons-react";
import { CronDbType } from "../../Scheduler/src/db";
import NewCron from "../sequences/NewCron";
import cronstrue from 'cronstrue'
import { LoadingButton, nextCronDates } from "../common";
import { useRouter } from "next/router";






const CronRow: FC<{
    cron: CronDbType,
    onChange: (cron: CronDbType) => void
    remove: (id: CronDbType['id']) => Promise<void>
}> = ({ cron, onChange, remove }) => {

    const [edit, setEdit] = useState(false)
    const [debouncedEdit] = useDebouncedValue(edit, 100)

    const router = useRouter()

    return (
        <>
            {edit && (
                <NewCron
                    opened={debouncedEdit}
                    initCron={cron}
                    onClose={(c) => {
                        setEdit(false)
                        c && onChange(c)
                    }}
                />
            )}
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>Preview</Text>
                <Text>
                    {cronstrue.toString(cron.cron, { monthStartIndexZero: true })}
                </Text>
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>Actions</Text>
                <Group>
                    <Button variant="light" onClick={() => setEdit(true)}>
                        <Group position="center">
                            <Edit size="16" />
                            Edit
                        </Group>
                    </Button>
                    <LoadingButton variant="light" color={'red'} confirm={true} onClick={(onDone) => remove(cron.id).finally(onDone)}>
                        <Group position="center">
                            <Trash size="16" />
                            Delete
                        </Group>
                    </LoadingButton>
                </Group>
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>Linked Sequences</Text>
                {cron.CronSequence.length ? (<Table highlightOnHover striped>
                    <thead>
                        <tr>
                            <th>Sequence</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cron.CronSequence.map(({ sequence }) => (
                            <tr
                                key={sequence.id}
                                onClick={() => router.push('/sequences/' + sequence.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    {sequence.name}
                                </td>
                                <td>
                                    {sequence.active ? "Activated" : 'Deactivated'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>) :
                    (<Text>No Linked Sequences</Text>)
                }
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>Next Trigger dates</Text>
                <Table highlightOnHover striped>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nextCronDates(cron.cron, 10).map(d => (
                            <tr key={d.toString()}>
                                <td>
                                    {d.toDateString()}
                                </td>
                                <td>
                                    {d.toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Group>
        </>
    )
}

export default CronRow
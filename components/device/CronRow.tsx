import { Button, Divider, Group, Table, Text } from "@mantine/core";
import { FC } from "react";
import { Edit, Link, Trash } from "tabler-icons-react";
import { CronDbType } from "../../Scheduler/src/db";
import cronstrue from 'cronstrue'
import { nextCronDates } from "../common";
import { useRouter } from "next/router";
import { usePrompt } from "../context";

interface CronRowProps {
    cron: CronDbType,
    onChange: (cron: CronDbType) => void
    remove: (id: CronDbType['id']) => void
}

const CronRow: FC<CronRowProps> = ({ cron, onChange, remove }) => {

    const router = useRouter()
    const prompt = usePrompt()

    return (
        <>
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
                    <Button variant="light" onClick={() => prompt?.newCron(newCron => newCron && onChange(newCron), cron)}>
                        <Group position="center">
                            <Edit size="16" />
                            Edit
                        </Group>
                    </Button>
                    <Button variant="light" onClick={() => prompt?.linkCron(newCron => newCron && onChange(newCron), cron.id, cron.CronSequence.map(s => s.sequence.id))}>
                        <Group position="center">
                            <Link size="16" />
                            Link
                        </Group>
                    </Button>
                    <Button
                        variant="light"
                        color={'red'}
                        onClick={() => remove(cron.id)}
                    >
                        <Group position="center">
                            <Trash size="16" />
                            Delete
                        </Group>
                    </Button>
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
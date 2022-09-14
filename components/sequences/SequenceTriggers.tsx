import { Accordion, Center, Container, Divider, Group, ScrollArea, Table, Text } from "@mantine/core";
import { FC } from "react";
import { SequenceDBType } from "../../Scheduler/src/db";
import { CronJob } from 'cron'

interface SequenceTriggersProps {
    cronTriggers: SequenceDBType['CronSequence']
}


const next = (cron: string, n: number) => {
    const ds = new CronJob(cron, Function).nextDates(n)
    return (Array.isArray(ds) ? ds : [ds]).map(d => new Date(d.toMillis()))
}


const SequenceTriggers: FC<SequenceTriggersProps> = ({ cronTriggers }) => {



    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">Triggers</Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
                <Center>
                    <Text py="xs">Cron Triggers</Text>
                </Center>
                <Divider />
                <Accordion>
                    {cronTriggers.map(({ cron }) => (
                        <Accordion.Item key={cron.id} iconPosition="right" label={cron.label} >

                            <Table striped highlightOnHover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {next(cron.cron, 5).map(d => (
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
                        </Accordion.Item>
                    ))}
                </Accordion>
            </ScrollArea>
        </Container>
    )
}

export default SequenceTriggers
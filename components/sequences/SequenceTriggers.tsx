import { Accordion, Center, Container, Divider, Group, ScrollArea, Table, Text } from "@mantine/core";
import { FC } from "react";
import { SequenceDBType } from "../../Scheduler/src/db";
import { CronJob } from 'cron'
import { nextCronDates } from "../common";

interface SequenceTriggersProps {
    cronTriggers: SequenceDBType['CronSequence']
}




const SequenceTriggers: FC<SequenceTriggersProps> = ({ cronTriggers }) => {

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">Triggers</Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
                <Accordion offsetIcon={!cronTriggers.length}>
                    <Accordion.Item label="Cron Triggers"  >
                        {cronTriggers.length ? (
                            <Accordion offsetIcon={false}  >
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
                                                {nextCronDates(cron.cron, 5).map(d => (
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
                        ) : (<Text>No cron triggers added</Text>)}
                    </Accordion.Item>
                </Accordion>
            </ScrollArea >
        </Container >
    )
}

export default SequenceTriggers
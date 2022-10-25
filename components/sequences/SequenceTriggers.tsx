import { Accordion, AccordionItem, Container, Divider, Group, ScrollArea, Tab, Table, Tabs, Text } from "@mantine/core";
import { FC } from "react";
import { SequenceDBType } from "../../Scheduler/src/db";
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
                <Tabs>
                    <Tab label="Cron" >
                        <Accordion>
                            {cronTriggers.map(({ cron }) => (
                                <AccordionItem label={cron.label} iconPosition="right" >
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
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Tab>
                    <Tab label="Sensors" disabled></Tab>
                </Tabs>
            </ScrollArea >
        </Container >
    )
}

export default SequenceTriggers
import { Accordion, Center, Divider, Group, Table, Text, ThemeIcon } from "@mantine/core";
import { FC } from "react";
import { CalendarOff } from "tabler-icons-react";
import { later } from ".";
import { SequenceDBType } from "../../Scheduler/src/db";
import Recurrences from "./Recurrences";

interface SequenceScheduleProps {
    schedule: SequenceDBType['schedule']
}


const next = (schedule: later.ScheduleData, n: number) => {
    const ds = later.schedule(schedule).next(n)
    later.schedule(schedule)
    return Array.isArray(ds) ? ds : [ds]
}


const SequenceSchedule: FC<SequenceScheduleProps> = ({ schedule }) => {

    later.date.localTime()

    const parsedSchedule: later.ScheduleData = JSON.parse(schedule.scheduleJson)

    return (
        <>
            <Center>
                <Text py="xs">Name: {schedule.label}</Text>
            </Center>
            <Divider />
            <Accordion>
                <Accordion.Item iconPosition="right" label={"Schedules"} >
                    <Recurrences recurrences={parsedSchedule.schedules} />
                </Accordion.Item>
                <Accordion.Item iconPosition="right" label={"Exceptions"} >
                    <Recurrences
                        recurrences={parsedSchedule.exceptions}
                        empty={
                            <Center>
                                <Group>
                                    <ThemeIcon variant="light" color={"gray"}>
                                        <CalendarOff />
                                    </ThemeIcon>
                                    <Text color={"gray"}>No Exceptions</Text>
                                </Group>
                            </Center>
                        }
                    />
                </Accordion.Item>
                <Accordion.Item iconPosition="right" label="Next Run">
                    <Table striped highlightOnHover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {next(JSON.parse(schedule.scheduleJson), 10).map(d => (
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
            </Accordion>
        </>
    )
}

export default SequenceSchedule
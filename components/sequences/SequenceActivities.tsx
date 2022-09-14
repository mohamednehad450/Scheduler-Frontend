import { Divider, Container, Group, ScrollArea, Table, Text } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { sequenceEvents } from "../../api"
import type { SequenceDBType, SequenceEventDBType } from "../../Scheduler/src/db"


interface SequenceActivitiesProps {
    sequence: SequenceDBType
}

const capitalizeFirst = (s: string) => {
    const arr = [...s]
    arr[0] = arr[0].toLocaleUpperCase()
    return arr.join('')
}
const SequenceActivities: FC<SequenceActivitiesProps> = ({ sequence }) => {

    const [events, setEvents] = useState<SequenceEventDBType[]>([])
    useEffect(() => {
        sequenceEvents.list(sequence.id, (err, events) => !err && events && setEvents(events))
    }, [sequence])
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">Activities</Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }} >
                <Table highlightOnHover striped>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(e => (
                            <tr key={e.id}>
                                <td>{new Date(e.date).toLocaleString()}</td>
                                <td>{capitalizeFirst(e.eventType)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </Container>
    )
}

export default SequenceActivities
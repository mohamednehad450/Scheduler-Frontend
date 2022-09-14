import { Divider, Container, Group, ScrollArea, Table, Text, ActionIcon, LoadingOverlay } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { Refresh, Trash } from "tabler-icons-react"
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

    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<SequenceEventDBType[]>([])
    useEffect(() => {

        sequenceEvents.listPromise(sequence.id)
            .then(d => d.data && setEvents(d.data))
            .catch(err => {
                //TODO
            })
            .finally(() => {
                setLoading(false)
            })
    }, [sequence])
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <LoadingOverlay visible={loading} />
            <Group pt="xs" position="apart">
                <Text size="xl">Activities</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => {
                        setLoading(true)
                        sequenceEvents.listPromise(sequence.id)
                            .then(d => {
                                setEvents(d.data)
                            })
                            .catch(err => {
                                // TODO
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    }} >
                        <Refresh size={24} />
                    </ActionIcon>
                    <ActionIcon color="red" size={24} onClick={() => {
                        setLoading(true)
                        sequenceEvents.deleteByObjectPromise(sequence.id)
                            .then(d => {
                                setEvents([])
                            })
                            .catch(err => {
                                // TODO
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    }} >
                        <Trash size={24} />
                    </ActionIcon>
                </Group>
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
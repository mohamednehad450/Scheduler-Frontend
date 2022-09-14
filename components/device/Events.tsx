import { ActionIcon, Container, Divider, Group, LoadingOverlay, ScrollArea, Table, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Plus, Refresh, Trash } from "tabler-icons-react";
import { sequenceEvents } from "../../api";
import { SequenceEventDBType } from "../../Scheduler/src/db";



const Events: FC = () => {

    const [events, setEvents] = useState<SequenceEventDBType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        sequenceEvents.listAllPromise()
            .then(d => {
                setEvents(d.data)
            })
            .catch(err => {
                // TODO
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <LoadingOverlay visible={loading} />
            <Group py="xs" position="apart">
                <Text size='xl'>{"Events"}</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => {
                        setLoading(true)
                        sequenceEvents.listAllPromise()
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
                        sequenceEvents.deleteAllPromise()
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
            {events.length ? (
                <ScrollArea pt="xs" m="0" p="0">
                    <Table striped highlightOnHover >
                        <tbody>
                            {events.map((e) => (
                                <tr key={e.id}>
                                    <td>{new Date(e.date).toLocaleString()}</td>
                                    <td>{e.sequence.name}</td>
                                    <td>{e.eventType}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ position: 'sticky', bottom: 0, background: 'white' }}>
                            <tr>
                                <th>Date</th>
                                <th>Sequence</th>
                                <th>Event</th>
                            </tr>
                        </tfoot>
                    </Table>
                </ScrollArea>
            ) : (
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "center",
                        justifyContent: 'center',
                    }}
                >
                    <Text>No Events</Text>
                </div>
            )}
        </Container>
    )
}


export default Events
import { Divider, Container, Group, ScrollArea, Table, Text, ActionIcon, LoadingOverlay, useMantineTheme } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { Refresh, Trash } from "tabler-icons-react"
import { usePrompt } from "../context"
import type { Sequence, SequenceEvent } from "../common"
import { useCRUD } from "../context"


interface SequenceActivitiesProps {
    sequence: Sequence
}

const capitalizeFirst = (s: string) => {
    const arr = [...s]
    arr[0] = arr[0].toLocaleUpperCase()
    return arr.join('')
}
const SequenceActivities: FC<SequenceActivitiesProps> = ({ sequence }) => {

    const theme = useMantineTheme()
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<SequenceEvent[]>([])

    const prompt = usePrompt()

    const crud = useCRUD()


    useEffect(() => {
        crud?.sequenceEvents?.listById(sequence.id)
            .then(d => d.data && setEvents(d.data))
            .catch(err => {
                //TODO
            })
            .finally(() => {
                setLoading(false)
            })
    }, [sequence, crud])
    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <LoadingOverlay visible={loading} />
            <Group pt="xs" position="apart">
                <Text size="xl">Activities</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => {
                        setLoading(true)
                        crud?.sequenceEvents?.listById(sequence.id)
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
                    <ActionIcon
                        color="red"
                        size={24}
                        onClick={() =>
                            prompt?.confirm((confirmed) => confirmed && crud?.sequenceEvents?.deleteById(sequence.id)
                                .then(d => {
                                    setEvents([])
                                })
                                .catch(err => {
                                    // TODO
                                })
                                ,
                                "Clear this sequence events?")
                        }
                    >
                        <Trash size={24} />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider />
            {events.length ? (
                <ScrollArea pt="xs" styles={{ root: { flex: 1 } }} >
                    <Table highlightOnHover striped>
                        <tbody>
                            {events.map(e => (
                                <tr key={e.id}>
                                    <td>{new Date(e.date).toLocaleString()}</td>
                                    <td>{capitalizeFirst(e.eventType)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot
                            style={{
                                backgroundColor: theme.colorScheme === "light" ? 'white' : 'black',
                                position: 'sticky',
                                bottom: 0,
                            }}
                        >
                            <tr>
                                <th>Date</th>
                                <th>Event</th>
                            </tr>
                        </tfoot>
                    </Table>
                </ScrollArea>
            ) : (
                <Group position="center" style={{ flex: 1, }}>
                    <Text>No activities yet</Text>
                </Group>
            )}
        </Container>
    )
}

export default SequenceActivities
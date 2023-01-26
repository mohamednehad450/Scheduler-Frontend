import { Divider, Container, Group, ScrollArea, Table, Text, ActionIcon, LoadingOverlay, useMantineTheme, Pagination } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { Refresh, Trash } from "tabler-icons-react"
import { usePrompt } from "../context"
import type { Sequence, SequenceEvent } from "../common"
import { useCRUD } from "../context"
import { useTranslation } from "react-i18next"
import { Pagination as Page } from "../../api"


interface SequenceActivitiesProps {
    sequence: Sequence
}

const SequenceActivities: FC<SequenceActivitiesProps> = ({ sequence }) => {

    const theme = useMantineTheme()
    const [loading, setLoading] = useState(true)
    const [events, setEvents] = useState<{ events: SequenceEvent[], page?: Page }>({ events: [] })

    const prompt = usePrompt()

    const crud = useCRUD()

    const { t } = useTranslation()


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
                <Text size="xl">{t("activities")}</Text>
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
                                    setEvents({ events: [] })
                                })
                                .catch(err => {
                                    // TODO
                                }),
                                `${t('clear_sequence_events')}`)
                        }
                    >
                        <Trash size={24} />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider />
            {events.events.length ? (
                <ScrollArea pt="xs" styles={{ root: { flex: 1 } }} >
                    <Table highlightOnHover striped>
                        <tbody>
                            {events.events.map(e => (
                                <tr key={e.id}>
                                    <td>{new Date(e.date).toLocaleString()}</td>
                                    <td>{t(e.eventType)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot
                            style={{
                                backgroundColor: theme.colorScheme === "light" ? 'white' : theme.colors.dark[4],
                                position: 'sticky',
                                bottom: 0,
                            }}
                        >
                            <tr>
                                <th style={{ textAlign: 'start' }}>{t('date')}</th>
                                <th style={{ textAlign: 'start' }}>{t('event')}</th>
                            </tr>
                        </tfoot>
                    </Table>
                </ScrollArea>
            ) : (
                <Group position="center" style={{ flex: 1, }}>
                    <Text>{t('zero_activities')}</Text>
                </Group>
            )}
            <Group position="right" px={"xs"} pt={"xs"}>
                <Pagination
                    total={Math.round((events.page?.total || 0) / (events.page?.perPage || 1))}
                    siblings={0}
                    onChange={page => {
                        setLoading(true)
                        crud?.sequenceEvents?.listById(sequence.id, { page })
                            .then(d => {
                                setEvents(d.data)
                            })
                            .catch(err => {
                                // TODO
                            })
                            .finally(() => {
                                setLoading(false)
                            })
                    }}
                />
            </Group>
        </Container>
    )
}

export default SequenceActivities
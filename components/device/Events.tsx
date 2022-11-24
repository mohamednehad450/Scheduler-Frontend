import { ActionIcon, Container, Divider, Group, LoadingOverlay, ScrollArea, Table, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Refresh, Trash } from "tabler-icons-react";
import { SequenceEvent } from "../common";
import { useCRUD, usePrompt } from "../context";



const Events: FC = () => {

    const [events, setEvents] = useState<SequenceEvent[]>([])
    const [loading, setLoading] = useState(true)
    const prompt = usePrompt()

    const { t } = useTranslation()

    const crud = useCRUD()

    useEffect(() => {
        crud?.sequenceEvents?.listAll()
            .then(d => {
                setEvents(d.data)
            })
            .catch(err => {
                // TODO
            })
            .finally(() => {
                setLoading(false)
            })
    }, [crud])

    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <LoadingOverlay visible={loading} />
            <Group py="xs" position="apart">
                <Text size='xl'>{t("events")}</Text>
                <Group>
                    <ActionIcon size={24} onClick={() => {
                        setLoading(true)
                        crud?.sequenceEvents?.listAll()
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
                            prompt?.confirm((confirmed) =>
                                confirmed && crud?.sequenceEvents?.deleteAll()
                                    .then(d => {
                                        setEvents([])
                                    })
                                    .catch(err => {
                                        // TODO
                                    })
                                , `${t("clear_events")}`)}
                    >
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
                                    <td>{t(e.eventType)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot style={{ position: 'sticky', bottom: 0, background: 'white' }}>
                            <tr>
                                <th style={{ textAlign: 'start' }}>{t("date")}</th>
                                <th style={{ textAlign: 'start' }}>{t("sequence")}</th>
                                <th style={{ textAlign: 'start' }}>{t("event")}</th>
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
                    <Text>{t('no_events')}</Text>
                </div>
            )}
        </Container>
    )
}


export default Events
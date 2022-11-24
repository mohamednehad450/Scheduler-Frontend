import { Accordion, AccordionItem, ActionIcon, Button, Container, Divider, Group, ScrollArea, Text, useMantineTheme } from "@mantine/core";
import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Refresh } from "tabler-icons-react";
import { Cron } from "../common";
import { useCRUD, usePrompt } from "../context";
import CronRow from "./CronRow";



const CronTriggers: FC = () => {

    const theme = useMantineTheme()
    const { t } = useTranslation()

    const [crons, setCrons] = useState<Cron[]>([])

    const prompt = usePrompt()
    const crud = useCRUD()

    const refresh = useCallback(() => crud?.cronCRUD?.list()
        .then(d => setCrons(d.data)), [crud])

    useEffect(() => {
        refresh()
    }, [refresh])


    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <Group py="xs" position="apart">
                <Text size='xl'>{t("schedules")}</Text>
                <Group>
                    <ActionIcon
                        size={24}
                        onClick={refresh}
                    >
                        <Refresh size={24} />
                    </ActionIcon>
                    <ActionIcon
                        size={24}
                        onClick={() => prompt?.newCron((cron) => cron && setCrons(cs => [cron, ...cs]))}
                    >
                        <Plus size={24} />
                    </ActionIcon>
                </Group>
            </Group>
            <Divider />
            {crons.length ? (
                <ScrollArea pt="xs" m="0" p="0" styles={{ scrollbar: { zIndex: 2 } }}>
                    <Accordion offsetIcon={true}>
                        {crons.map((cron, i) => (
                            <AccordionItem
                                key={cron.id}
                                label={cron.label}
                                styles={{
                                    itemTitle: {
                                        zIndex: 1,
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: theme.colorScheme === 'light' ? 'white' : 'black'
                                    },
                                }}
                            >
                                <CronRow
                                    cron={cron}
                                    onChange={(newCron) => {
                                        setCrons((crons) => {
                                            crons[i] = newCron
                                            return [...crons]
                                        })
                                    }}
                                    remove={id =>
                                        prompt?.confirm(confirmed =>
                                            confirmed &&
                                            crud?.cronCRUD?.remove(id)
                                                .then(() => setCrons(cs => cs.filter(c => c.id !== id)))
                                                .catch(err => {
                                                    // TODO
                                                })
                                        )
                                    }
                                />
                            </AccordionItem>
                        ))}
                    </Accordion>
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
                    <Text>{t('no_schedules_defined')}</Text>
                    <Button onClick={() => prompt?.newCron((cron) => cron && setCrons(cs => [cron, ...cs]))} variant="subtle">{t("add_new_schedule")}</Button>
                </div>
            )}
        </Container>
    )
}


export default CronTriggers
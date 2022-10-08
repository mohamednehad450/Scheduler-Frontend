import { Accordion, AccordionItem, ActionIcon, Button, Container, Divider, Group, ScrollArea, Text, useMantineTheme } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FC, useEffect, useState } from "react";
import { Plus, Refresh } from "tabler-icons-react";
import { cronCRUD } from "../../api";
import { CronDbType } from "../../Scheduler/src/db";
import { usePrompt } from "../context";
import NewCron from "../sequences/NewCron";
import CronRow from "./CronRow";



const CronTriggers: FC = () => {

    const theme = useMantineTheme()

    const [crons, setCrons] = useState<CronDbType[]>([])

    const [newCron, setNewCron] = useState(false)
    const [debouncedNewCron] = useDebouncedValue(newCron, 100)

    const prompt = usePrompt()

    const refresh = () => cronCRUD.list()
        .then(d => setCrons(d.data))

    useEffect(() => {
        refresh()
    }, [])


    return (
        <Container my="0" px="sm" py="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', }} >
            <Group py="xs" position="apart">
                <Text size='xl'>{"Cron Triggers"}</Text>
                <Group>
                    <ActionIcon
                        size={24}
                        onClick={refresh}
                    >
                        <Refresh size={24} />
                    </ActionIcon>
                    <ActionIcon
                        size={24}
                        onClick={() => setNewCron(true)}
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
                                            cronCRUD.remove(id)
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
                    <Text>No cron triggers</Text>
                    <Button onClick={() => setNewCron(true)} variant="subtle">Add new cron</Button>
                </div>
            )}
            {newCron && (
                <NewCron
                    opened={debouncedNewCron}
                    onClose={() => {
                        setNewCron(false)
                        cronCRUD.list()
                            .then(d => setCrons(d.data))
                            .catch(err => {
                                // TODO
                            })
                    }}
                />
            )}
        </Container>
    )
}


export default CronTriggers
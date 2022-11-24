import { Button, Divider, Group, Table, Text } from "@mantine/core";
import { FC } from "react";
import { Edit, Link, Trash } from "tabler-icons-react";
import { Cron } from "../common";
import cronstrue from 'cronstrue'
import { nextCronDates } from "../common";
import { useRouter } from "next/router";
import { usePrompt } from "../context";
import { useTranslation } from "react-i18next";

interface CronRowProps {
    cron: Cron,
    onChange: (cron: Cron) => void
    remove: (id: Cron['id']) => void
}

const CronRow: FC<CronRowProps> = ({ cron, onChange, remove }) => {

    const router = useRouter()
    const prompt = usePrompt()

    const { t } = useTranslation()

    return (
        <>
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>{t("schedule_description")}</Text>
                <Text>
                    {cronstrue.toString(cron.cron, { monthStartIndexZero: true })}
                </Text>
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>{t("actions")}</Text>
                <Group>
                    <Button variant="light" onClick={() => prompt?.newCron(newCron => newCron && onChange(newCron), cron)}>
                        <Group position="center">
                            <Edit size="16" />
                            {t('edit')}
                        </Group>
                    </Button>
                    <Button variant="light" onClick={() => prompt?.linkCron(newCron => newCron && onChange(newCron), cron.id, cron.CronSequence.map(s => s.sequence.id))}>
                        <Group position="center">
                            <Link size="16" />
                            {t("link")}
                        </Group>
                    </Button>
                    <Button
                        variant="light"
                        color={'red'}
                        onClick={() => remove(cron.id)}
                    >
                        <Group position="center">
                            <Trash size="16" />
                            {t("delete")}
                        </Group>
                    </Button>
                </Group>
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>{t("linked_sequences")}</Text>
                {cron.CronSequence.length ? (<Table highlightOnHover striped>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'start' }}>{t("sequence")}</th>
                            <th style={{ textAlign: 'start' }}>{t("status")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cron.CronSequence.map(({ sequence }) => (
                            <tr
                                key={sequence.id}
                                onClick={() => router.push('/sequences/' + sequence.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>
                                    {sequence.name}
                                </td>
                                <td>
                                    {sequence.active ? `${t("activated")}` : t('deactivated')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>) :
                    (<Text>{t("no_linked_sequences")}</Text>)
                }
            </Group>
            <Divider />
            <Group direction="column" py="sm">
                <Text size="sm" color={'gray'}>{t("next_trigger_dates")}</Text>
                <Table highlightOnHover striped>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'start' }}>{t('date')}</th>
                            <th style={{ textAlign: 'start' }}>{t("time")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nextCronDates(cron.cron, 10).map(d => (
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
            </Group>
        </>
    )
}

export default CronRow
import { Button, Divider, Group, Modal, Text, TextInput, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Cron } from "../common";
import cronstrue from 'cronstrue'
import CronInput from "./CronInput";
import { useCRUD } from "../context";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

interface NewCronProps {
    opened: boolean
    onClose: (newCron?: Cron) => void
    initCron?: Cron
}


const NewCron: FC<NewCronProps> = ({ opened, onClose, initCron }) => {

    const theme = useMantineTheme()
    const crud = useCRUD()

    const { t } = useTranslation()

    const [label, setLabel] = useState(initCron?.label || '')
    const [cron, setCron] = useState(initCron?.cron || '* * * * *')

    const [err, setErr] = useState({
        label: ''
    })

    useEffect(() => { !label && setErr({ label: '' }) }, [label])
    useEffect(() => {
        if (opened) {
            setErr({ label: '' })
            setLabel(initCron?.label || '')
            setCron(initCron?.cron || '* * * * * *')
        }
    }, [opened])

    const router = useRouter()


    return (
        <Modal
            title={initCron ? `${t("edit")} ${initCron.label}` : t("add_new_schedule")}
            opened={opened}
            onClose={() => onClose()}
            size="lg"
            overflow="inside"
        >
            <TextInput
                p="md"
                label={t("label")}
                description={t("schedule_label")}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                error={err.label}
                required
            />
            <Divider />
            <CronInput initCron={cron} onChange={setCron} />
            <Divider />
            <Group p="md" direction="column" style={{ zIndex: 1, boxShadow: theme.shadows.xs, position: 'sticky', top: 0, backgroundColor: theme.colorScheme === 'light' ? 'white' : 'black' }}>
                <Text size="sm" color={'gray'}>{t("preview")}</Text>
                <Group px="sm">
                    <Text size="lg">{cronstrue.toString(cron, { monthStartIndexZero: true, locale: router.locale || 'en' })}</Text>
                </Group>
            </Group>
            <Group p={'md'} position="right">
                <Button variant="subtle" onClick={() => onClose()}>
                    {t("cancel")}
                </Button>
                <Button
                    onClick={() => {
                        if (!label) {
                            setErr({ label: t("required_name") })
                            return
                        }

                        const func = async () => initCron ? crud?.cronCRUD?.update(initCron.id, { label, cron }) : crud?.cronCRUD?.add({ label, cron });

                        func && func()
                            .then(d => {
                                d?.data && onClose(d.data)
                            })
                            .catch(err => {
                                // TODO
                            })
                    }}
                >
                    {t("submit")}
                </Button>
            </Group>
        </Modal>
    )
}


export default NewCron
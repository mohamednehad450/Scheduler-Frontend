import { Button, Divider, Group, Modal, Text, TextInput, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { CronDbType } from "../../Scheduler/src/db";
import cronstrue from 'cronstrue'
import CronInput from "./CronInput";
import { useCRUD } from "../context";

interface NewCronProps {
    opened: boolean
    onClose: (newCron?: CronDbType) => void
    initCron?: CronDbType
}


const NewCron: FC<NewCronProps> = ({ opened, onClose, initCron }) => {

    const theme = useMantineTheme()
    const crud = useCRUD()

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


    return (
        <Modal
            title={initCron ? 'Edit ' + initCron.label : "Add new cron"}
            opened={opened}
            onClose={() => onClose()}
            size="lg"
            overflow="inside"
        >
            <TextInput
                p="md"
                label="Label"
                description={'Cron trigger label'}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                error={err.label}
                required
            />
            <Divider />
            <CronInput initCron={cron} onChange={setCron} />
            <Divider />
            <Group p="md" direction="column" style={{ zIndex: 1, boxShadow: theme.shadows.xs, position: 'sticky', top: 0, backgroundColor: theme.colorScheme === 'light' ? 'white' : 'black' }}>
                <Text size="sm" color={'gray'}>{'Preview'}</Text>
                <Group px="sm">
                    <Text size="lg">{cronstrue.toString(cron, { monthStartIndexZero: true, })}</Text>
                </Group>
            </Group>
            <Group p={'md'} position="right">
                <Button variant="subtle" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        if (!label) {
                            setErr({ label: 'You must provide a label' })
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
                    {initCron ? "Save" : "Submit"}
                </Button>
            </Group>
        </Modal>
    )
}


export default NewCron
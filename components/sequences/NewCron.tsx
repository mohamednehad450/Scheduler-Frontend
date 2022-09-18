import { Button, Divider, Group, Modal, Text, TextInput, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { cronCRUD } from "../../api";
import { CronDbType } from "../../Scheduler/src/db";
import { formatHour, getDayName, getMonthName } from "../common";
import CronInput from "./CronInput";
import cronstrue from 'cronstrue'
import { useDebouncedValue } from "@mantine/hooks";

interface NewCronProps {
    opened: boolean
    onClose: (newCron?: CronDbType) => void
}


const NewCron: FC<NewCronProps> = ({ opened, onClose }) => {

    const theme = useMantineTheme()

    const [label, setLabel] = useState('')

    const [err, setErr] = useState({
        label: ''
    })

    useEffect(() => { setErr(err => ({ ...err, label: '' })) }, [label])

    const [secCron, setSecCron] = useState('*')
    const [minCron, setMinCron] = useState('*')
    const [hourCron, setHourCron] = useState('*')
    const [domCron, setDomCron] = useState('*')
    const [monthCron, setMonthCron] = useState('*')
    const [dowCron, setDowCron] = useState('*')

    const [preview] = useDebouncedValue(`${secCron} ${minCron} ${hourCron} ${domCron} ${monthCron} ${dowCron}`, 100)

    return (
        <Modal
            title="Add new cron"
            opened={opened}
            onClose={onClose}
            centered
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
            <Group p="md" direction="column" style={{ zIndex: 1, boxShadow: theme.shadows.xs, position: 'sticky', top: 0, backgroundColor: theme.colorScheme === 'light' ? 'white' : 'black' }}>
                <Text size="sm" color={'gray'}>{'Preview'}</Text>
                <Group px="sm">
                    <Text size="lg">{cronstrue.toString(preview, { monthStartIndexZero: true, })}</Text>
                </Group>
            </Group>
            <CronInput
                label="Second"
                min={0}
                max={59}
                formatLabel={(n) => n + ``}
                initialValue={secCron}
                onChange={(s) => setSecCron(s)}
            />
            <Divider />

            <CronInput
                label="Minute"
                min={0}
                max={59}
                formatLabel={(n) => n + ``}
                initialValue={minCron}
                onChange={(s) => setMinCron(s)}
            />
            <Divider />

            <CronInput
                label="Hour"
                min={0}
                max={23}
                formatLabel={formatHour}
                initialValue={hourCron}
                onChange={(s) => setHourCron(s)}
            />
            <Divider />
            <CronInput
                label="Day of month"
                min={1}
                max={31}
                initialValue={domCron}
                onChange={(s) => setDomCron(s)}
            />
            <Divider />
            <CronInput
                label="Month"
                min={0}
                max={11}
                formatLabel={getMonthName}
                initialValue={monthCron}
                onChange={(s) => setMonthCron(s)}
            />
            <Divider />
            <CronInput
                label="Day of week"
                min={0}
                max={6}
                formatLabel={getDayName}
                initialValue={dowCron}
                onChange={(s) => setDowCron(s)}
            />
            <Divider />
            <Group p={'md'} position="right">
                <Button variant="subtle" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    if (!label) {
                        setErr({ label: 'You must provide a label' })
                        return
                    }
                    cronCRUD.add({
                        label,
                        cron: [secCron, minCron, hourCron, domCron, monthCron, dowCron].join(' ')
                    })
                        .then(d => {
                            onClose(d.data)
                        })
                        .catch(err => {
                            // TODO
                        })

                }}>
                    Submit
                </Button>
            </Group>
        </Modal>
    )
}


export default NewCron
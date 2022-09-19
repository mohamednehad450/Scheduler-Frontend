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
    initCron?: CronDbType
}

const parseCron = (c: string) => {
    const arr = c.split(' ')
    if (arr.length === 5) {
        return {
            sec: '0',
            min: arr[0],
            hour: arr[1],
            dom: arr[2],
            month: arr[3],
            dow: arr[4],
        }
    }
    if (arr.length === 6) {
        return {
            sec: arr[0],
            min: arr[1],
            hour: arr[2],
            dom: arr[3],
            month: arr[4],
            dow: arr[5],
        }
    }
    else {
        return {
            sec: '*',
            min: '*',
            hour: '*',
            dom: '*',
            month: '*',
            dow: '*',
        }
    }
}


const NewCron: FC<NewCronProps> = ({ opened, onClose, initCron }) => {

    const theme = useMantineTheme()

    const [label, setLabel] = useState(initCron?.label)

    const [err, setErr] = useState({
        label: ''
    })

    useEffect(() => { setErr(err => ({ ...err, label: '' })) }, [label])

    const { sec, min, hour, dom, month, dow } = parseCron(initCron?.cron || '')

    const [secCron, setSecCron] = useState(sec)
    const [minCron, setMinCron] = useState(min)
    const [hourCron, setHourCron] = useState(hour)
    const [domCron, setDomCron] = useState(dom)
    const [monthCron, setMonthCron] = useState(month)
    const [dowCron, setDowCron] = useState(dow)

    const [preview] = useDebouncedValue(`${secCron} ${minCron} ${hourCron} ${domCron} ${monthCron} ${dowCron}`, 100)

    return (
        <Modal
            title={initCron ? 'Edit ' + initCron.label : "Add new cron"}
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
                <Button
                    onClick={() => {
                        if (!label) {
                            setErr({ label: 'You must provide a label' })
                            return
                        }
                        const cronString = [secCron, minCron, hourCron, domCron, monthCron, dowCron].join(' ')
                        const func = () => initCron ?
                            cronCRUD.update(initCron.id, { label, cron: cronString }) :
                            cronCRUD.add({ label, cron: cronString })
                        func()
                            .then(d => {
                                onClose(d.data)
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
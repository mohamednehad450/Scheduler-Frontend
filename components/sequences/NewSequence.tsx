import { Button, Divider, Group, LoadingOverlay, Modal, ScrollArea, Select, Switch, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { useSchedule } from "../context/schedule";
import { useSequence } from "../context/sequences";
import OrdersInput, { OrderInput } from "./OrdersInput";


type SequenceInput = {
    name: string,
    active: boolean,
    orders: { create: OrderInput[] },
    scheduleId: number

}


const NewSequence: FC<{ opened: boolean, onClose: () => void }> = ({ opened, onClose }) => {

    const schedule = useSchedule()
    const seq = useSequence()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [sequence, setSequence] = useState<SequenceInput>({
        name: '',
        active: false,
        orders: {
            create: []
        },
        scheduleId: -1
    })

    const [error, setError] = useState({
        name: '',
        scheduleId: '',
        orders: ''
    })

    useEffect(() => {
        setError({
            name: '',
            scheduleId: '',
            orders: ''
        })
    }, [sequence])

    useEffect(() => {
        schedule?.refresh()
    }, [])





    return (
        <Modal
            size={'lg'}
            centered
            opened={opened}
            onClose={onClose}
            title="Add New Sequence"
        >
            <Divider />
            <ScrollArea
                styles={{ viewport: { height: '24rem' } }}
                py={'md'}
                px="sm"
            >

                <Group p="xs">
                    <TextInput
                        required
                        value={sequence.name}
                        onChange={(e) => setSequence(s => ({ ...s, name: e.target.value }))}
                        label="Name"
                        error={error.name}
                    />
                </Group>

                <Group p="xs">
                    <Select
                        required
                        placeholder="- Select Schedule"
                        value={String(sequence.scheduleId)}
                        onChange={(scheduleId) => setSequence(s => ({ ...s, scheduleId: Number(scheduleId) }))}
                        label="Schedule"
                        data={schedule?.list.map(s => ({ value: String(s.id), label: s.label })) || []}
                        error={error.scheduleId}
                    />
                    <Switch pt="xl" checked={sequence.active} onChange={(e) => setSequence(s => ({ ...s, active: e.target.checked }))} label="Activate" />
                </Group>

                <OrdersInput
                    error={error.orders}
                    orders={sequence.orders.create}
                    onChange={os => setSequence(s => ({ ...s, orders: { create: os } }))}
                />

            </ScrollArea>
            <Group position="right">
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m="sm"
                    variant='subtle'
                    onClick={onClose}
                >
                    {"Cancel"}
                </Button>
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m='sm'
                    onClick={() => {
                        let err = false
                        if (!sequence.name) {
                            setError(e => ({ ...e, name: 'You must provide a name.' }))
                            err = true
                        }
                        if (sequence.scheduleId === -1) {
                            setError(e => ({ ...e, scheduleId: 'You must select a schedule' }))
                            err = true
                        }
                        if (sequence.orders.create.length < 1) {
                            setError(e => ({ ...e, orders: 'You must add at least 1 channel' }))
                            err = true
                        }
                        if (err) return
                        setLoading(true)
                        seq?.add(sequence, (err, newSeq) => {
                            if (err) {
                                // TODO
                                setLoading(false)
                                return
                            }
                            router.push('sequences/' + newSeq?.id)
                            setLoading(false)
                        })
                    }}
                >
                    <LoadingOverlay visible={loading} />
                    {"Submit"}
                </Button>
            </Group>
        </Modal >
    )
}

export default NewSequence
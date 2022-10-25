import { Button, Divider, Group, Modal, ScrollArea, Switch, TextInput } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { pinsCRUD, sequenceCRUD } from "../../api";
import { PinDbType, SequenceDBType } from "../../Scheduler/src/db";
import { LoadingButton } from "../common";
import { usePrompt } from "../context";
import OrdersInput, { OrderInput } from "./OrdersInput";


type SequenceInput = {
    name: string,
    active: boolean,
    orders: OrderInput[],
}

interface NewSequenceProps {
    opened: boolean,
    onClose: (newSeq?: SequenceDBType) => void,
    initialSequence?: SequenceDBType
}


const NewSequence: FC<NewSequenceProps> = ({ onClose, initialSequence, opened }) => {

    const [sequence, setSequence] = useState<SequenceInput>({
        name: initialSequence?.name || '',
        active: initialSequence?.active || false,
        orders: initialSequence?.orders.map(({ offset, duration, channel }) => ({ offset, duration, channel })) || []
    })
    const [error, setError] = useState({
        name: '',
        orders: ''
    })
    const [pins, setPins] = useState<PinDbType[]>([])


    const prompt = usePrompt()


    useEffect(() => {
        if (opened) {
            pinsCRUD.list()
                .then(d => setPins(d.data))
            setSequence({
                name: initialSequence?.name || '',
                active: initialSequence?.active || false,
                orders: initialSequence?.orders.map(({ offset, duration, channel }) => ({ offset, duration, channel })) || []
            })
            setError({
                name: '',
                orders: '',
            })
        }
    }, [opened])


    useEffect(() => {
        setError({
            name: '',
            orders: ''
        })
    }, [sequence])


    return (
        <Modal
            size={'xl'}
            opened={opened}
            onClose={() => onClose()}
            title={initialSequence ? `Edit ${initialSequence.name}` : "Add New Sequence"}
            overflow="inside"
        >
            <Divider pt="md" />
            <ScrollArea
                styles={{ viewport: { minHeight: '24rem' } }}
            >
                <Group p="xs">
                    <TextInput
                        required
                        value={sequence.name}
                        onChange={(e) => setSequence(s => ({ ...s, name: e.target.value }))}
                        label="Name"
                        error={error.name}
                    />
                    <Switch
                        px="md"
                        mt="xl"
                        checked={sequence.active}
                        onChange={(e) => setSequence(s => ({ ...s, active: e.target.checked }))}
                        label="Active"
                    />
                </Group>
                <Group p="xs">
                    <OrdersInput
                        error={error.orders}
                        orders={sequence.orders}
                        pins={pins}
                        onChange={orders => setSequence(s => ({ ...s, orders }))}
                    />
                </Group>
            </ScrollArea>
            <Group position="right" sx={(theme) => ({ position: 'sticky', bottom: 0, backgroundColor: theme.colorScheme === "dark" ? 'black' : "white" })}>
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m="sm"
                    variant='subtle'
                    onClick={() => onClose()}
                >
                    Cancel
                </Button>
                <LoadingButton
                    styles={{ root: { minWidth: '6rem' } }}
                    m='sm'
                    onClick={(onDone) => {
                        let err = false
                        if (!sequence.name) {
                            setError(e => ({ ...e, name: 'You must provide a name.' }))
                            err = true
                        }
                        if (sequence.orders.length < 1) {
                            setError(e => ({ ...e, orders: 'You must add at least 1 channel' }))
                            err = true
                        }
                        if (err) {
                            onDone()
                            return
                        }
                        const func = initialSequence ?
                            sequenceCRUD.update(initialSequence.id, sequence) :
                            sequenceCRUD.add(sequence)
                        func
                            .then(({ data: newSeq }) => {
                                if (initialSequence) {
                                    onClose(newSeq)
                                } else {
                                    onClose()
                                    prompt?.confirm((confirmed) => {
                                        confirmed ?
                                            prompt.linkSequence((seq) => onClose(seq || newSeq), newSeq.id) :
                                            onClose(newSeq)
                                    }, 'Link cron triggers to this sequence?')
                                }
                            })
                            .catch(err => {
                                // TODO
                            })
                            .finally(() => onDone())
                    }}
                >
                    Submit
                </LoadingButton>
            </Group>
        </Modal>

    )
}

export default NewSequence
import { Button, Divider, Group, Modal, ScrollArea, Switch, TextInput } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pin, Sequence, LoadingButton } from "../common";
import { useCRUD, usePrompt } from "../context";
import OrdersInput, { OrderInput } from "./OrdersInput";


type SequenceInput = {
    name: string,
    active: boolean,
    orders: OrderInput[],
}

interface NewSequenceProps {
    opened: boolean,
    onClose: (newSeq?: Sequence) => void,
    initialSequence?: Partial<Sequence>
}


const NewSequence: FC<NewSequenceProps> = ({ onClose, initialSequence, opened }) => {

    const [sequence, setSequence] = useState<SequenceInput>({
        name: initialSequence?.name || '',
        active: initialSequence?.active || false,
        orders: initialSequence?.orders?.map(({ offset, duration, channel }) => ({ offset, duration, channel })) || []
    })
    const [error, setError] = useState({
        name: '',
        orders: ''
    })
    const [pins, setPins] = useState<Pin[]>([])

    const crud = useCRUD()

    const prompt = usePrompt()

    const { t } = useTranslation()


    useEffect(() => {
        if (opened) {
            crud?.pinsCRUD?.list()
                .then(d => setPins(d.data))
            setSequence({
                name: initialSequence?.name || '',
                active: initialSequence?.active || false,
                orders: initialSequence?.orders?.map(({ offset, duration, channel }) => ({ offset, duration, channel })) || []
            })
            setError({
                name: '',
                orders: '',
            })
        }
    }, [opened, crud])


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
            title={initialSequence?.id ? `${t('edit')} ${initialSequence.name || ''}` : t('add_new_sequence')}
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
                        label={t("name")}
                        error={error.name}
                    />
                    <Switch
                        px="md"
                        mt="xl"
                        dir="ltr"
                        checked={sequence.active}
                        onChange={(e) => setSequence(s => ({ ...s, active: e.target.checked }))}
                        label={t("active")}
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
            <Group
                position="right"
                sx={(theme) => ({
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[7] : "white"
                })}
            >
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m="sm"
                    variant='subtle'
                    onClick={() => onClose()}
                >
                    {t("cancel")}
                </Button>
                <LoadingButton
                    styles={{ root: { minWidth: '6rem' } }}
                    m='sm'
                    onClick={(onDone) => {
                        let err = false
                        if (!sequence.name) {
                            setError(e => ({ ...e, name: t("required_name") }))
                            err = true
                        }
                        if (sequence.orders.length < 1) {
                            setError(e => ({ ...e, orders: t("min_orders") }))
                            err = true
                        }
                        if (err) {
                            onDone()
                            return
                        }
                        const func = initialSequence?.id ?
                            crud?.sequenceCRUD?.update(initialSequence.id, sequence) :
                            crud?.sequenceCRUD?.add(sequence)
                        func && func
                            .then(({ data: newSeq }) => {
                                if (initialSequence) {
                                    onClose(newSeq)
                                } else {
                                    onClose()
                                    prompt?.confirm((confirmed) => {
                                        confirmed ?
                                            prompt.linkSequence((seq) => onClose(seq || newSeq), newSeq.id) :
                                            onClose(newSeq)
                                    }, `${t("link_sequence_schedule")}`)
                                }
                            })
                            .catch(err => {
                                // TODO
                            })
                            .finally(() => onDone())
                    }}
                >
                    {t("submit")}
                </LoadingButton>
            </Group>
        </Modal>

    )
}

export default NewSequence
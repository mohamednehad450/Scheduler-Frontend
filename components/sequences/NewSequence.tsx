import { ActionIcon, Button, Divider, Group, LoadingOverlay, Modal, MultiSelect, ScrollArea, Stepper, Switch, Text, TextInput, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { CircleCheck, Plus } from "tabler-icons-react";
import { cronCRUD, cronSequence, pinsCRUD, sequenceCRUD } from "../../api";
import { CronDbType, PinDbType, SequenceDBType } from "../../Scheduler/src/db";
import CronSelect from "./CronSelect";
import OrdersInput, { OrderInput } from "./OrdersInput";


type SequenceInput = {
    name: string,
    active: boolean,
    orders: { create: OrderInput[] },
}


const NewSequence: FC<{
    opened: boolean,
    onClose: (newSeq?: SequenceDBType) => void,
    initialSequence?: SequenceDBType
}> = ({ onClose, initialSequence, opened }) => {

    const [crons, setCrons] = useState<CronDbType[]>([])
    const [pins, setPins] = useState<PinDbType[]>([])

    useEffect(() => {
        cronCRUD.list()
            .then(d => setCrons(d.data))
        pinsCRUD.list()
            .then(d => setPins(d.data))
    }, [])

    const router = useRouter()


    const [loading, setLoading] = useState(false)
    const [sequence, setSequence] = useState<SequenceInput>({
        name: initialSequence?.name || '',
        active: initialSequence?.active || false,
        orders: {
            create: initialSequence?.orders.map(({ offset, duration, channel }) => ({ offset, duration, channel })) || []
        },
    })

    const [newSequence, setNewSequence] = useState<SequenceDBType>()


    const [triggers, setTriggers] = useState<{
        seqId?: number,
        cronsIds: number[]
    }>({
        seqId: initialSequence?.id || undefined,
        cronsIds: initialSequence?.CronSequence.map(c => c.cron.id) || []
    })

    const [step, setStep] = useState(0)

    const [error, setError] = useState({
        name: '',
        orders: ''
    })

    useEffect(() => {
        setError({
            name: '',
            orders: ''
        })
    }, [sequence])



    return (
        <Modal
            size={'lg'}
            centered
            opened={opened}
            onClose={() => onClose()}
            title={initialSequence ? `Edit ${initialSequence.name}` : "Add New Sequence"}
        >
            <Divider pt="md" />
            <Stepper
                styles={{ content: { minHeight: '12rem' }, steps: { padding: `0 2rem`, } }}
                active={step}
                breakpoint="xs"
                size="sm"
            >
                <Stepper.Step label="First step" description={initialSequence ? `Edit ${initialSequence.name}` : "Create new Sequence"}>
                    <ScrollArea
                        styles={{ viewport: { height: '24rem' } }}
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

                        </Group>
                        <OrdersInput
                            error={error.orders}
                            orders={sequence.orders.create}
                            pins={pins}
                            onChange={os => setSequence(s => ({ ...s, orders: { create: os } }))}
                        />
                    </ScrollArea>
                </Stepper.Step>
                <Stepper.Step label="Second step" description="Add Triggers" >
                    <CronSelect
                        crons={crons}
                        value={triggers.cronsIds}
                        onChange={cronsIds => setTriggers(t => ({ ...t, cronsIds }))}
                    />
                </Stepper.Step>
                <Stepper.Completed>
                    <div style={{ minHeight: '11rem', display: 'grid', placeItems: 'center' }}>
                        <ThemeIcon size={96} variant="outline" style={{ borderWidth: 0 }}  >
                            <CircleCheck size={96} />
                        </ThemeIcon>
                        <Text>All Done.</Text>
                    </div>
                </Stepper.Completed>
            </Stepper>

            <Group position="right">
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m="sm"
                    variant='subtle'
                    onClick={[
                        () => onClose(),
                        () => setStep(2),
                        () => setStep(1),
                    ][step]}
                >
                    {["Cancel", "Skip", "Back"][step]}
                </Button>
                <Button
                    styles={{ root: { minWidth: '6rem' } }}
                    m='sm'
                    onClick={[
                        () => {
                            let err = false
                            if (!sequence.name) {
                                setError(e => ({ ...e, name: 'You must provide a name.' }))
                                err = true
                            }

                            if (sequence.orders.create.length < 1) {
                                setError(e => ({ ...e, orders: 'You must add at least 1 channel' }))
                                err = true
                            }
                            if (err) return
                            setLoading(true)
                            initialSequence ?
                                sequenceCRUD.update(initialSequence.id, sequence)
                                    .then(({ data: newSeq }) => {
                                        setStep(1)
                                        setTriggers({ seqId: newSeq.id, cronsIds: newSeq.CronSequence.map(c => c.cron.id) })
                                        setNewSequence(newSeq)
                                        setLoading(false)
                                    })
                                    .catch(err => {
                                        // TODO
                                        setLoading(false)
                                        return

                                    })
                                : sequenceCRUD.add(sequence)
                                    .then(({ data: newSeq }) => {
                                        setStep(1)
                                        setTriggers({ seqId: newSeq.id, cronsIds: [] })
                                        setNewSequence(newSeq)
                                        setLoading(false)
                                    })
                                    .catch(err => {
                                        // TODO
                                        setLoading(false)
                                        return
                                    })
                        },
                        () => { triggers.seqId && cronSequence.linkSequencePromise(triggers.seqId, triggers.cronsIds).then(() => setStep(2)) },
                        () => initialSequence ? onClose(newSequence) : router.push('/sequences/' + triggers.seqId)
                    ][step]}
                >
                    <LoadingOverlay visible={loading} />
                    {["Next", "Next", "Done"][step]}
                </Button>
            </Group>
        </Modal>

    )
}

export default NewSequence
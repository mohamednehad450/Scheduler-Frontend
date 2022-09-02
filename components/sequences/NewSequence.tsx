import { ActionIcon, Button, Group, LoadingOverlay, MultiSelect, ScrollArea, Stepper, Text, TextInput, ThemeIcon } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { CircleCheck, Plus } from "tabler-icons-react";
import { cronCRUD, cronSequence, pinsCRUD, sequenceCRUD } from "../../api";
import { CronDbType, PinDbType, } from "../../Scheduler/src/db";
import OrdersInput, { OrderInput } from "./OrdersInput";


type SequenceInput = {
    name: string,
    active: boolean,
    orders: { create: OrderInput[] },
}


const NewSequence: FC<{ onClose: () => void }> = ({ onClose }) => {

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
        name: '',
        active: false,
        orders: {
            create: []
        },
    })


    const [triggers, setTriggers] = useState<{
        seqId?: number,
        cronsIds: number[]
    }>({
        cronsIds: []
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
        <>
            <Stepper
                styles={{ content: { minHeight: '12rem' }, steps: { padding: `0 2rem`, } }}
                active={step}
                breakpoint="xs"
                size="sm"
            >
                <Stepper.Step label="First step" description="Create new Sequence">
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
                    <Group p="xs">
                        <MultiSelect
                            size="md"
                            data={crons.map(c => ({ value: String(c.id), label: c.label })) || []}
                            value={triggers.cronsIds.map(String)}
                            label="Cron Triggers"
                            placeholder="- Select Triggers"
                            onChange={(cronsIds) => setTriggers(t => ({ ...t, cronsIds: cronsIds.map(Number) }))}
                            rightSection={(
                                <ActionIcon size={"sm"} color="gray" onClick={() => alert('to be implemented')}>
                                    <Plus />
                                </ActionIcon>
                            )}
                        />
                    </Group>
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
                            sequenceCRUD.add(sequence)
                                .then(({ data: newSeq }) => {

                                    setStep(1)
                                    setTriggers({ seqId: newSeq.id, cronsIds: newSeq.CronSequence.map(c => c.cron.id) })
                                    setLoading(false)
                                })
                                .catch(err => {
                                    // TODO
                                    setLoading(false)
                                    return

                                })
                        },
                        () => { triggers.seqId && cronSequence.linkSequencePromise(triggers.seqId, triggers.cronsIds).then(() => setStep(2)) },
                        () => router.push('/sequences/' + triggers.seqId)
                    ][step]}
                >
                    <LoadingOverlay visible={loading} />
                    {["Next", "Next", "Done"][step]}
                </Button>
            </Group>
        </ >
    )
}

export default NewSequence
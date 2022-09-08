import { Button, Divider, Group, Modal, Radio, RadioGroup, Select, TextInput } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { pinsCRUD } from "../../api";
import { PinDbType } from "../../Scheduler/src/db";
import { LoadingButton } from "../common";



interface NewPinsProps {
    opened: boolean
    onClose: () => void
    usedPins: { [key: PinDbType['channel']]: true }
}

const channels = [
    3,
    5,
    7,
    8,
    10,
    11,
    12,
    13,
    15,
    16,
    18,
    19,
    21,
    22,
    23,
    24,
    26,
    29,
    31,
    32,
    33,
    35,
    36,
    37,
    38,
    40,
]

const NewPin: FC<NewPinsProps> = ({ opened, onClose, usedPins: initUsedPins }) => {

    const [pin, setPin] = useState<Partial<PinDbType>>({
        label: '',
        onState: "HIGH"
    })
    const [usedPins, setUsedPins] = useState(initUsedPins)
    const [err, setErr] = useState({
        channel: '',
        label: '',
    })

    useEffect(() => {
        setErr({
            label: '',
            channel: ''
        })
    }, [pin])

    return (
        <Modal
            centered
            opened={opened}
            onClose={onClose}
            title="Add new pin"
        >
            <Divider mb="sm" />
            <TextInput
                py="xs"
                label="Label"
                description="Choose pin label"
                required
                value={pin.label}
                error={err.label}
                onChange={(e) => setPin(p => ({ ...p, label: e.target.value }))}
            />
            <Select
                py="xs"
                label="Channel"
                description="Pick pin channel"
                required
                data={channels.filter(c => !usedPins[c]).map(String)}
                onChange={v => v && setPin(p => ({ ...p, channel: Number(v) }))}
                value={String(pin.channel)}
                error={err.channel}
            />
            <RadioGroup
                py="xs"
                label="On State"
                description="Select pin on state"
                required
                value={pin.onState}
                onChange={onState => setPin(p => ({ ...p, onState }))}
            >
                <Radio value="HIGH" label="High" />
                <Radio value="LOW" label="Low" />
            </RadioGroup>

            <Group position="right" py="xs">
                <Button
                    onClick={() => onClose()}
                    variant="subtle"
                >
                    Cancel
                </Button>
                <LoadingButton
                    onClick={(onDone) => {
                        if (!pin.label) {
                            setErr(err => ({ ...err, label: 'You must provide a label' }))
                        }
                        if (!pin.channel) {
                            setErr(err => ({ ...err, channel: 'You must select a channel' }))
                        }

                        if (pin.label && pin.channel) {
                            pinsCRUD.add(pin)
                                .then((d) => {
                                    onDone()
                                    setPin({
                                        label: '',
                                        onState: "HIGH"
                                    })
                                    setUsedPins(u => ({ ...u, [d.data.channel]: true }))
                                })
                                .catch(err => {
                                    onDone()
                                    // TODO
                                })
                        } else {
                            onDone()
                        }

                    }}
                    variant="light"
                >
                    {"Submit & Add another"}
                </LoadingButton>
                <LoadingButton
                    onClick={(onDone) => {
                        if (!pin.label) {
                            setErr(err => ({ ...err, label: 'You must provide a label' }))
                        }
                        if (!pin.channel) {
                            setErr(err => ({ ...err, channel: 'You must select a channel' }))
                        }

                        if (pin.label && pin.channel) {
                            pinsCRUD.add(pin)
                                .then(() => {
                                    onDone()
                                    onClose()
                                })
                                .catch(err => {
                                    onDone()
                                    // TODO
                                })
                        } else {
                            onDone()
                        }
                    }}
                >
                    Submit
                </LoadingButton>
            </Group>
        </Modal>
    )
}


export default NewPin
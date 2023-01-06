import { Button, Divider, Group, Modal, Radio, RadioGroup, Select, TextInput } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoadingButton, Pin } from "../common";
import { useCRUD } from "../context";



interface NewPinsProps {
    opened: boolean
    initialPin?: Pin
    onClose: (pin?: Pin) => void
    usedPins: { [key: Pin['channel']]: true }
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

const NewPin: FC<NewPinsProps> = ({ opened, onClose, initialPin, usedPins: initUsedPins }) => {

    const [pin, setPin] = useState<Partial<Pin>>(initialPin || {
        label: '',
        onState: "HIGH"
    })
    const [usedPins, setUsedPins] = useState(initUsedPins)
    const [err, setErr] = useState({
        channel: '',
        label: '',
    })

    const crud = useCRUD()
    const { t } = useTranslation()

    useEffect(() => {
        setErr({
            label: '',
            channel: ''
        })
    }, [pin])

    useEffect(() => {
        setUsedPins(initUsedPins)
        setPin(initialPin || {
            label: '',
            onState: "HIGH"
        })
    }, [opened])

    return (
        <Modal
            centered
            opened={opened}
            onClose={() => onClose()}
            title={initialPin ? "Edit " + initialPin.label : t("add_new_pin")}
        >
            <Divider mb="sm" />
            <TextInput
                py="xs"
                label={t("label")}
                description={t("choose_pin_label")}
                required
                value={pin.label}
                error={err.label}
                onChange={(e) => setPin(p => ({ ...p, label: e.target.value }))}
            />
            <Select
                py="xs"
                label={t("channel")}
                description={t("pick_pin_channel")}
                required
                data={channels.filter(c => !usedPins[c] || c === initialPin?.channel).map(String)}
                onChange={v => v && setPin(p => ({ ...p, channel: Number(v) }))}
                value={String(pin.channel)}
                error={err.channel}
            />
            <RadioGroup
                py="xs"
                label={t('on_state')}
                description={t("select_pin_on_state")}
                required
                value={pin.onState}
                onChange={onState => setPin(p => ({ ...p, onState }))}
            >
                <Radio value="HIGH" label={t('HIGH')} />
                <Radio value="LOW" label={t('LOW')} />
            </RadioGroup>

            <Group position="right" py="xs">
                <Button
                    onClick={() => onClose()}
                    variant="subtle"
                >
                    {t("cancel")}
                </Button>
                {!initialPin && (<LoadingButton
                    onClick={(onDone) => {
                        if (!pin.label) {
                            setErr(err => ({ ...err, label: t('required_name') }))
                        }
                        if (!pin.channel) {
                            setErr(err => ({ ...err, channel: t('required_channel') }))
                        }

                        if (pin.label && pin.channel) {
                            crud?.pinsCRUD?.add(pin)
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
                    {t("submit_add_another")}
                </LoadingButton>)}
                <LoadingButton
                    onClick={(onDone) => {
                        if (!pin.label) {
                            setErr(err => ({ ...err, label: t('required_name') }))
                        }
                        if (!pin.channel) {
                            setErr(err => ({ ...err, channel: t('required_channel') }))
                        }

                        if (pin.label && pin.channel) {
                            const res = initialPin ? crud?.pinsCRUD?.update(initialPin.channel, { ...pin }) : crud?.pinsCRUD?.add(pin)
                            res && res.then((r) => {
                                onDone()
                                initialPin ? onClose(r.data) : onClose()
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
                    {t("submit")}
                </LoadingButton>
            </Group>
        </Modal>
    )
}


export default NewPin
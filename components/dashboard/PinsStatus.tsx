import { Button, Card, Group, Tabs, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pin, Sequence } from "../common";
import { DeviceState, DeviceStateHandler, ChannelChangeHandler, useSocket, usePrompt, useCRUD } from "../context";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC<{ sequences: Sequence[] }> = ({ sequences }) => {

    const sContext = useSocket()
    const prompt = usePrompt()
    const crud = useCRUD()

    const { t } = useTranslation()

    const [pins, setPins] = useState<Pin[]>([])
    const [deviceState, setDeviceState] = useState<DeviceState>({
        channelsStatus: {},
        reservedPins: [],
        runningSequences: [],
    })


    useEffect(() => {
        crud?.pinsCRUD?.list()
            .then(d => setPins(d.data))

        // Socket is not connected, Manually getting device state
        if (!sContext?.socket) {
            const interval = setInterval(() => {
                sContext?.fallback.getState()
                    .then(r => setDeviceState(r.data))
                    .catch(err => {
                        console.log(err)
                    })
            }, 1000)

            return () => { clearInterval(interval) }
        }

        const handleState: DeviceStateHandler = (newState) => {
            setDeviceState((oldState) => ({ ...oldState, ...newState }))
        }

        const handleChannelChange: ChannelChangeHandler = (change) => setDeviceState(old => ({
            ...old,
            channelsStatus: { ...old.channelsStatus, ...change }
        }))

        sContext?.socket?.on('state', handleState)
        sContext?.socket?.on('channelChange', handleChannelChange)

        sContext?.socket?.emit('state')
        return () => {
            sContext?.socket?.removeListener('state', handleState)
            sContext?.socket?.removeListener('channelChange', handleChannelChange)
        }
    }, [sContext?.socket, crud])


    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label={t("all_pins")}>
                    <ScrollList
                        body={pins.length && pins.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={deviceState.channelsStatus[s.channel]} />
                        ))}
                        empty={
                            <>
                                <Text>{t("no_pins_defined")}</Text>
                                <Button
                                    onClick={() => prompt?.newPin(
                                        () => crud?.pinsCRUD?.list().then(d => setPins(d.data)),
                                        pins.reduce((acc, pin) => ({ ...acc, [pin.channel]: true }), {})
                                    )}
                                    variant="subtle"
                                >
                                    {t("add_new_pin")}
                                </Button>
                            </>
                        }
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>{t('pin')}</Text>
                                <Text weight={'bold'} >{t('status')}</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
                <Tabs.Tab label={t('reserved_pins')}>
                    <ScrollList
                        body={deviceState.reservedPins?.length && deviceState.reservedPins.map((s) => (
                            <Group key={s.pin.channel} p={'xs'} position="apart" style={{ borderBottom: "2px solid #e9ecef" }}>
                                <Text size="sm">{s.pin.label}</Text>
                                <Text size="sm">{sequences.find(seq => s.sequenceId === seq.id)?.name || "NULL"}</Text>
                            </Group>
                        ))}
                        empty={<Text>{t("no_reserved_pins")}</Text>}
                        footer={
                            <Group position="apart" p={'xs'}>
                                <Text weight={'bold'}>{t('pin')}</Text>
                                <Text weight={'bold'} >{t('sequence')}</Text>
                            </Group >
                        }
                    />
                </Tabs.Tab>
            </Tabs>
        </Card>
    )
}

export default PinsStatus
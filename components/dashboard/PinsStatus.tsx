import { Button, Card, Group, LoadingOverlay, Tabs, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pin, Sequence } from "../common";
import { DeviceState, DeviceStateHandler, ChannelChangeHandler, useSocket, usePrompt, useAuth, useCRUD } from "../context";
import PinStatusRow from "./PinStatusRow";
import ScrollList from "./ScrollList";



const PinsStatus: FC<{ sequences: Sequence[] }> = ({ sequences }) => {

    const socket = useSocket()
    const prompt = usePrompt()
    const crud = useCRUD()

    const { t } = useTranslation()

    const [pins, setPins] = useState<Pin[]>([])
    const [channelsStatus, setChannelsStatus] = useState<DeviceState['channelsStatus']>()
    const [reservedPins, setReservedPins] = useState<DeviceState['reservedPins']>()

    useEffect(() => {
        if (!socket) return
        crud?.pinsCRUD?.list()
            .then(d => setPins(d.data))

        const handleState: DeviceStateHandler = ({ reservedPins, channelsStatus }) => {
            channelsStatus && setChannelsStatus(channelsStatus)
            reservedPins && setReservedPins(reservedPins)
        }
        const handleChannelChange: ChannelChangeHandler = (change) => setChannelsStatus(old => ({ ...old, ...change }))

        socket?.on('state', handleState)
        socket?.on('channelChange', handleChannelChange)

        socket?.emit('state')
        return () => {
            socket?.removeListener('state', handleState)
            socket?.removeListener('channelChange', handleChannelChange)
        }
    }, [socket, crud])


    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Tabs variant="default">
                <Tabs.Tab label={t("all_pins")}>
                    <ScrollList
                        body={pins.length && pins.map(s => (
                            <PinStatusRow key={s.channel} label={s.label} running={!!channelsStatus && channelsStatus[s.channel]} />
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
                        body={reservedPins?.length && reservedPins.map((s) => (
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
            <LoadingOverlay visible={!socket || !channelsStatus || !reservedPins} />
        </Card>
    )
}

export default PinsStatus
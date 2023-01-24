import { Card, Container, Divider, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TickHandler, useSocket } from "../context";




const DeviceTime: FC = () => {

    const sContext = useSocket()
    const [time, setTime] = useState<Date>()

    const { t } = useTranslation()

    useEffect(() => {
        if (!sContext?.socket) {
            const interval = setInterval(() => {
                sContext?.fallback.getTime().then(r => setTime(new Date(r.data.time)))
            }, 1000)
            return () => { clearInterval(interval) }
        }

        const tick: TickHandler = (time: string) => {
            setTime(new Date(time))
        }

        sContext?.socket?.on('tick', tick)
        sContext?.socket?.emit('tick', null, true)

        return () => {
            sContext?.socket?.removeListener('tick', tick);
            sContext?.socket?.emit('tick', null, false)
        }

    }, [sContext?.socket])

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Container style={{ height: '16rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }} >
                <Group pt="sm" style={{ display: 'block' }}>
                    <Text weight={500} size='lg'>{t('device_time')}</Text>
                    <Divider />
                </Group>
                <Group style={{ flex: 4, display: 'flex', justifyContent: 'center' }} m="lg" position='center' direction='column'>
                    <Text color={'gray'} >{time?.toDateString()}</Text>
                    <Title>{time?.toLocaleTimeString()}</Title>
                </Group>
            </Container>
            <LoadingOverlay visible={!time} />
        </Card>
    )
}


export default DeviceTime
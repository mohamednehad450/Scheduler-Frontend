import { Button, Card, Container, Divider, Group, LoadingOverlay, Text, Title } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { TickHandler, useSocket } from "../context";




const DeviceTime: FC = () => {

    const socket = useSocket()
    const [time, setTime] = useState<Date>()

    useEffect(() => {
        const tick: TickHandler = (time: string) => {
            setTime(new Date(time))
        }
        socket?.on('tick', tick)
        socket?.emit('tick', null, true)

        return () => {
            socket?.removeListener('tick', tick);
            socket?.emit('tick', null, false)
        }

    }, [socket])

    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Container style={{ height: '16rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }} >
                <Group pt="sm" style={{ display: 'block' }}>
                    <Text weight={500} size='lg'>Device Time</Text>
                    <Divider />
                </Group>
                <Group style={{ flex: 4, display: 'flex', justifyContent: 'center' }} m="lg" position='center' direction='column'>
                    <Text color={'gray'} >{time?.toDateString()}</Text>
                    <Title>{time?.toLocaleTimeString()}</Title>
                </Group>

                <Group style={{ flex: 1 }}>
                    <Button disabled fullWidth variant='subtle'>Set Device Time</Button>
                </Group>
            </Container>
            <LoadingOverlay visible={!socket || !time} />
        </Card>
    )
}


export default DeviceTime
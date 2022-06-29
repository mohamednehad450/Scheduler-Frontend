import { Button, Card, Container, Divider, Group, Text, Title } from "@mantine/core";
import { FC } from "react";
import { useActions } from "../context/actions";




const DeviceTime: FC = () => {
    const actions = useActions()
    return (
        <Card shadow="sm" p="sm" radius={'md'} style={{ height: '18rem', }}  >
            <Container style={{ height: '16rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }} >
                <Group pt="sm" style={{ display: 'block' }}>
                    <Text weight={500} size='lg'>Device Time</Text>
                    <Divider />
                </Group>
                <Group style={{ flex: 4, }} py="lg" m="lg" position='center' direction='column'>
                    <Text color={'gray'} >{actions?.state.deviceTime?.toDateString()}</Text>
                    <Title>{actions?.state.deviceTime?.toLocaleTimeString()}</Title>
                </Group>

                <Group style={{ flex: 1 }}>
                    <Button disabled fullWidth variant='subtle'>Set Device Time</Button>
                </Group>
            </Container>
        </Card>
    )
}


export default DeviceTime
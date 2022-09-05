import { Grid, Container, Card } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Channels } from '../components/device'

const g = {
    sm: 12,
    md: 6,
    lg: 6,
    xl: 6,
    span: 12
}


const Device: NextPage = () => {
    return (
        <>
            <Head>
                <title>
                    Scheduler: Device
                </title>
            </Head>
            <Container size={'lg'} m="sm" p="sm">
                <Grid gutter="md">
                    <Grid.Col {...g} >
                        <Card shadow="lg" p="xs" radius={'md'} style={{ height: '22rem', }}>
                            <Channels />
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    )
}

export default Device

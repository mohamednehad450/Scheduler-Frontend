import { Grid, Container, } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { useSequence } from '../components/context/sequences'
import { DeviceTime, PinsStatus, Sequences } from '../components/dashboard'

const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  span: 12
}


const Home: NextPage = () => {
  const seq = useSequence()
  useEffect(() => { seq?.refresh() }, [])
  return (
    <>
      <Head>
        <title>
          Scheduler: Dashboard
        </title>
      </Head>
      <Container size={'lg'} m="sm" p="sm">
        <Grid gutter="md">
          <Grid.Col {...g} >
            <DeviceTime />
          </Grid.Col>
          <Grid.Col {...g} >
            <PinsStatus />
          </Grid.Col>
          <Grid.Col {...g} >
            <Sequences />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default Home

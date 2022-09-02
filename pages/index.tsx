import { Grid, Container, } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { pinsCRUD, sequenceCRUD } from '../api'
import { DeviceTime, PinsStatus, Sequences } from '../components/dashboard'
import { PinDbType, SequenceDBType } from '../Scheduler/src/db'

const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  span: 12
}


const Home: NextPage = () => {

  const [pins, setPins] = useState<PinDbType[]>([])
  const [sequences, setSequences] = useState<SequenceDBType[]>([])


  useEffect(() => {
    sequenceCRUD.list()
      .then(d => setSequences(d.data))
    pinsCRUD.list()
      .then(d => setPins(d.data))
  }, [])
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
            <PinsStatus pins={pins} sequences={sequences} />
          </Grid.Col>
          <Grid.Col {...g} >
            <Sequences sequences={sequences} />
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}

export default Home

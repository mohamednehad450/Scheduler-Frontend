import { Grid, Container, } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useCRUD } from '../components/context'
import { useSocket } from '../components/context'
import { DeviceTime, PinsStatus, Sequences } from '../components/dashboard'
import { SequenceDBType } from '../Scheduler/src/db'

const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  span: 12
}


const Home: NextPage = () => {

  const [sequences, setSequences] = useState<SequenceDBType[]>([])
  const socket = useSocket()

  const crud = useCRUD()

  useEffect(() => {
    if (!socket) return
    crud?.sequenceCRUD?.list()
      .then(d => setSequences(d.data))
  }, [socket, crud])

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
            <PinsStatus sequences={sequences} />
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

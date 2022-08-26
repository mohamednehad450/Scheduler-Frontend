import { Card as _Card, Container, Grid, LoadingOverlay, Title } from '@mantine/core'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSequence } from '../../components/context/sequences'
import { SequenceDBType } from '../../Scheduler/src/db'
import { Card, OrdersPreview, SequenceActions, SequenceActivities, SequenceTriggers } from '../../components/sequences'



const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  span: 12
}
const g2 = {
  sm: 12,
  md: 12,
  lg: 6,
  xl: 8,
  span: 12
}

const Sequence: NextPage = () => {
  const router = useRouter()
  const [sequence, setSequence] = useState<SequenceDBType>()
  const seq = useSequence()
  useEffect(() => {
    if (Array.isArray(router.query.id) || isNaN(Number(router.query.id))) {
      return
    }
    const id = Number(router.query.id)
    seq?.get(id, (err, s) => {
      if (err || !s) {
        router.push('/sequences')
        return
      }
      setSequence(s)
    })
  }, [router.query])

  return (
    <>
      <Head>
        <title>({sequence?.name}) - Scheduler</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sequence ? <Container size={'lg'} m="sm" p="sm">
        <Title p={'lg'}>{sequence?.name}</Title>
        <Grid gutter="md">
          <Grid.Col {...g2} >
            <Card
              title='Orders Preview'
              body={<OrdersPreview orders={sequence?.orders || []} />} />
          </Grid.Col>
          <Grid.Col {...g} >
            <Card title='Actions' body={(
              <SequenceActions sequence={sequence} onChange={seq => setSequence(seq)} />
            )} />
          </Grid.Col>
          <Grid.Col {...g} >
            <Card
              title='Triggers'
              body={<SequenceTriggers cronTriggers={sequence.CronSequence} />}
            />
          </Grid.Col>
          <Grid.Col {...g} >
            <Card
              title='Activities'
              body={<SequenceActivities sequence={sequence} />} />
          </Grid.Col>

        </Grid>
      </Container> : <LoadingOverlay visible={true} />}
    </>
  )
}

export default Sequence

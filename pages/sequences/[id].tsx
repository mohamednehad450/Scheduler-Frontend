import { Card, Container, Grid, LoadingOverlay, Title } from '@mantine/core'
import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Sequence } from '../../components/common'
import { OrdersPreview, SequenceActions, SequenceActivities, SequenceTriggers } from '../../components/sequences'
import { useCRUD } from '../../components/context'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'



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
  lg: 12,
  xl: 8,
  span: 12
}

const Sequence: NextPage = () => {

  const router = useRouter()
  const [sequence, setSequence] = useState<Sequence>()

  const crud = useCRUD()
  const { t } = useTranslation()


  useEffect(() => {
    if (!router.query.id) return
    if (Array.isArray(router.query.id)) {
      router.push('/sequences')
      return
    }
    const id = router.query.id
    crud?.sequenceCRUD?.get(id)
      .then(d => { d.data ? setSequence(d.data) : router.push('/sequences/') })
      .catch(err => {
        router.push('/sequences')
        return
      })
  }, [router.query, crud])

  return (
    <>
      <Head>
        <title>({sequence?.name}) - {t('scheduler')}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sequence ? <Container size={'lg'} m="sm" p="sm">
        <Title p={'lg'}>{sequence?.name}</Title>
        <Grid gutter="md">
          <Grid.Col {...g2} >
            <Card shadow="lg" p="xs" radius={'md'} style={{ height: '18rem' }}>
              <OrdersPreview orders={sequence?.orders || []} />
            </Card>
          </Grid.Col>
          <Grid.Col {...g} >
            <Card shadow="lg" p="xs" radius={'md'} style={{ height: '18rem' }}>
              <SequenceActions sequence={sequence} onChange={seq => setSequence(seq)} />
            </Card>
          </Grid.Col>
          <Grid.Col {...g} >
            <Card shadow="lg" p="xs" radius={'md'} style={{ height: '18rem' }}>
              <SequenceTriggers cronTriggers={sequence.crons} />
            </Card>
          </Grid.Col>
          <Grid.Col {...g} >
            <Card shadow="lg" p="xs" radius={'md'} style={{ height: '18rem' }}>
              <SequenceActivities sequence={sequence} />
            </Card>
          </Grid.Col>
        </Grid>
      </Container> : <LoadingOverlay visible={true} />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'en', ['common']),
  },
})

export default Sequence

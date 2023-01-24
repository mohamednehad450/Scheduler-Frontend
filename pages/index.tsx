import { Grid, Container, } from '@mantine/core'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useCRUD } from '../components/context'
import { useSocket } from '../components/context'
import { DeviceTime, PinsStatus, Sequences } from '../components/dashboard'
import { Sequence } from '../components/common'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
const g = {
  sm: 12,
  md: 6,
  lg: 6,
  xl: 4,
  span: 12
}


const Home: NextPage = () => {

  const [sequences, setSequences] = useState<Sequence[]>([])
  const sContext = useSocket()

  const crud = useCRUD()

  const { t } = useTranslation()

  useEffect(() => {
    crud?.sequenceCRUD?.list()
      .then(d => setSequences(d.data))
  }, [sContext?.socket, crud])

  return (
    <>
      <Head>
        <title>
          {t('dashboard_title')}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale ?? 'en', ['common']),
  },
})

export default Home

import { Tabs, Container, Title, Group, ActionIcon } from '@mantine/core'
import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Calendar, CalendarOff, List, Plus, Refresh, } from 'tabler-icons-react';
import { SequenceList } from '../../components/sequences'
import { Sequence } from '../../components/common'
import { usePrompt } from '../../components/context';
import { useRouter } from 'next/router';
import { useCRUD } from '../../components/context';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const lists: ('all' | 'active' | 'running')[] = ['all', 'active', 'running']
const Sequences: NextPage = () => {
    const [active, setActive] = useState(0)
    const [sequences, setSequences] = useState<Sequence[]>([])

    const router = useRouter()
    const prompt = usePrompt()
    const crud = useCRUD()

    const { t } = useTranslation()

    useEffect(() => {
        crud?.sequenceCRUD?.list()
            .then(d => setSequences(d.data))
    }, [crud])


    return (
        <>
            <Head>
                <title>{t('sequences_title')}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container size={'lg'} p="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', }} >
                <Group position='apart'>
                    <Title p={'lg'}>{t('sequences')}</Title>
                    <Group>
                        <ActionIcon
                            color={'gray'}
                            variant='light'
                            size={32}
                            mx="xs"
                            onClick={() => prompt?.newSequence((newSeq) => newSeq && router.push('/sequences/' + newSeq.id))}
                        >
                            <Plus size={32} />
                        </ActionIcon>
                        <ActionIcon
                            color={'gray'}
                            variant='light'
                            size={32}
                            mx="xs"
                            onClick={() => {
                                setSequences([])
                                crud?.sequenceCRUD?.list()
                                    .then(d => setSequences(d.data))
                            }}
                        >
                            <Refresh size={32} />
                        </ActionIcon>
                    </Group>
                </Group>
                <Tabs variant='outline' active={active} onTabChange={setActive} tabPadding={0} >
                    <Tabs.Tab label={t("all")} icon={<List size={16} />} />
                    <Tabs.Tab label={t("activated")} icon={<Calendar size={16} />} />
                    <Tabs.Tab label={t("running")} icon={<CalendarOff size={16} />} />
                </Tabs>
                <Container
                    size={'lg'}
                    m="0"
                    p="0"
                    sx={s => ({
                        background: s.colorScheme === 'light' ? s.white : s.black,
                        height: '100%'
                    })}>
                    <SequenceList
                        sequences={sequences}
                        onChange={setSequences}
                        show={lists[active]}
                    />
                </Container>
            </Container>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale ?? 'en', ['common']),
    },
})


export default Sequences

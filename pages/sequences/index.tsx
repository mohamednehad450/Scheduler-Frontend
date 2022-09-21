import { Tabs, Container, Title, Group, ActionIcon, } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Calendar, CalendarOff, List, Plus, } from 'tabler-icons-react';
import { NewSequence, SequenceList } from '../../components/sequences'
import { SequenceDBType } from '../../Scheduler/src/db'
import { sequenceCRUD } from '../../api'


const lists: ('all' | 'active' | 'running')[] = ['all', 'active', 'running']
const Sequences: NextPage = () => {

    const [active, setActive] = useState(0)
    const [add, setAdd] = useState(false)

    const [sequences, setSequences] = useState<SequenceDBType[]>([])
    useEffect(() => {
        sequenceCRUD.list()
            .then(d => setSequences(d.data))
    }, [])

    return (
        <>
            <Head>
                <title>Sequences - Scheduler</title>
                <meta name="description" content="" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container size={'lg'} p="0" style={{ height: '100%', display: 'flex', flexDirection: 'column', }} >
                <Group position='apart'>
                    <Title p={'lg'}>Sequences</Title>
                    <ActionIcon
                        color={'gray'}
                        variant='outline'
                        m='lg'
                        size={32}
                        onClick={() => setAdd(true)}
                    >
                        <Plus size={32} />
                    </ActionIcon>

                </Group>
                <Tabs variant='outline' active={active} onTabChange={setActive} tabPadding={0} >
                    <Tabs.Tab label="All" icon={<List size={16} />} />
                    <Tabs.Tab label="Activated" icon={<Calendar size={16} />} />
                    <Tabs.Tab label="Running" icon={<CalendarOff size={16} />} />
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
                        addNew={() => setAdd(true)}
                    />
                </Container>
            </Container>
            <NewSequence opened={add} onClose={() => setAdd(false)} />
        </>
    )
}


export default Sequences

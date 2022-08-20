import { Tabs, Container, Title, Group, ActionIcon } from '@mantine/core'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSequence } from '../../components/context/sequences'
import { Calendar, CalendarOff, List, Plus, } from 'tabler-icons-react';
import { useActions } from '../../components/context/actions'
import { NewSequence, SequenceList } from '../../components/sequences'

const Sequences: NextPage = () => {

    const [active, setActive] = useState(0)
    const [add, setAdd] = useState(false)
    const seq = useSequence()
    useEffect(() => { seq?.refresh() }, [])
    const actions = useActions()

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
                    <NewSequence opened={add} onClose={() => setAdd(false)} />
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
                    <SequenceList sequences={seq?.list.filter(s => {
                        switch (active) {
                            case 0:
                                // All
                                return true
                            case 1:
                                // Active
                                return s.active
                            case 2:
                                // Running 
                                return (actions?.state.runningSequences || []).some(id => id === s.id)
                            default:
                                return false
                        }
                    })} />
                </Container>
            </Container>
        </>
    )
}


export default Sequences

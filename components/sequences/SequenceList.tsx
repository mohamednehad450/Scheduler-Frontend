import { Button, Group, Table, Text } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import type { Sequence } from '../common'
import { DeviceState, DeviceStateHandler, usePrompt, useSocket } from '../context'
import SequenceRow from './SequenceRow'
import { v4 } from 'uuid'
import { useRouter } from 'next/router'
import { useCRUD } from '../context'
import { useTranslation } from 'react-i18next'

interface SequenceListProps {
    sequences: Sequence[]
    onChange: (sequences: Sequence[]) => void
    show: 'running' | 'active' | 'all'
}


const SequenceList: FC<SequenceListProps> = ({ sequences, onChange, show }) => {

    const socket = useSocket()
    const [runningSequences, setRunningSequences] = useState<DeviceState['runningSequences']>([])

    const crud = useCRUD()

    const router = useRouter()
    const prompt = usePrompt()
    const { t } = useTranslation()

    useEffect(() => {
        const handleState: DeviceStateHandler = ({ runningSequences }) => {
            runningSequences && setRunningSequences(runningSequences)
        }
        socket?.on('state', handleState)
        socket?.emit('state')
        return () => { socket?.removeListener('state', handleState) }
    }, [socket])

    const list = sequences.map((s, i) => ({ ...s, i }))?.filter(s => {
        switch (show) {
            case 'all':
                return true
            case 'active':
                return s.active
            case 'running':
                return runningSequences.some(id => id === s.id)
        }
    })

    return (
        <>
            {list.length ? (
                <Table
                    striped
                    highlightOnHover
                    verticalSpacing={'xs'}
                    horizontalSpacing="sm"
                    sx={theme => ({ ":hover": { cursor: "pointer" } })}
                >
                    <thead style={{ position: 'sticky' }}>
                        <tr>
                            <th style={{ textAlign: 'start' }}>
                                {t('name')}
                            </th>
                            <th style={{ textAlign: 'start' }}>
                                {t('last_run')}
                            </th>
                            <th style={{ textAlign: 'start' }}>
                                {t('no_triggers')}
                            </th>
                            <th style={{ textAlign: 'start' }}>
                                {t('actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody >
                        {list.map(s => (
                            <SequenceRow
                                key={String(s.id)}
                                isRunning={runningSequences.some(id => id === s.id)}
                                sequence={s}
                                remove={(id) =>
                                    prompt?.confirm((confirmed) =>
                                        confirmed && crud?.sequenceCRUD?.remove(id)
                                            .then(() => {
                                                onChange(sequences.filter((seq) => id !== seq.id))
                                            })
                                            .catch((err) => {
                                                // TODO
                                            })
                                    )}
                                onChange={(newSeq) => {
                                    const newSequences = [...sequences]
                                    newSequences[s.i] = newSeq
                                    onChange(newSequences)
                                }}
                                run={(id, onDone) => {
                                    const actionId = v4()
                                    socket?.emit('run', actionId, id)
                                    socket?.once(actionId, (ok: boolean, err: Error | null) => {
                                        onDone && onDone()
                                        // TODO: Error handling    
                                    })
                                }}
                                stop={(id, onDone) => {
                                    const actionId = v4()
                                    socket?.emit('stop', actionId, id)
                                    socket?.once(actionId, (ok: boolean, err: Error | null) => {
                                        onDone && onDone()
                                        // TODO: Error handling    
                                    })
                                }}
                            />
                        ))}
                    </tbody>
                </Table>
            ) :
                <Group style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%", placeItems: 'center' }}>
                    {(show === "all" || !sequences.length ? (
                        <Group direction='column' position='center' >
                            <Text>{t("no_sequences_defined")}</Text>
                            <Button variant='subtle' onClick={() => prompt?.newSequence((newSeq) => newSeq && router.push('/sequences/' + newSeq.id))}>
                                {t('add_new_sequences')}
                            </Button>
                        </Group>
                    ) :
                        (<Text>{show === "active" ? t("no_active_sequences") : t('no_running_sequences')}</Text>))}
                </Group>
            }
        </>
    )
}
export default SequenceList

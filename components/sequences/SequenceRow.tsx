import { Group, Text, ActionIcon, Tooltip, MediaQuery, Menu } from '@mantine/core'
import { FC, MouseEventHandler } from 'react'
import { Calendar, CalendarOff, Copy, Edit, PlayerPause, PlayerPlay, Trash, } from 'tabler-icons-react';
import type { Sequence } from '../common'
import { useRouter } from 'next/router';
import { useCRUD, usePrompt } from '../context';
import { useTranslation } from 'react-i18next';

const stopPropagation: (cb?: MouseEventHandler) => MouseEventHandler = (cb) => (e) => {
    e.stopPropagation()
    cb && cb(e)
}

interface SequenceRowProps {
    sequence: Sequence,
    isRunning: boolean,
    run: (id: Sequence['id'], onDone?: () => void) => void
    stop: (id: Sequence['id'], onDone?: () => void) => void
    remove: (id: Sequence['id']) => void
    onChange: (seq: Sequence) => void
}


const SequenceRow: FC<SequenceRowProps> = ({ sequence, isRunning, run, stop, remove, onChange }) => {

    const router = useRouter()
    const prompt = usePrompt()
    const crud = useCRUD()
    const { t } = useTranslation()

    const updateSequence = () => crud?.sequenceCRUD?.get(sequence.id)
        .then(d => d.data && onChange(d.data))
        .catch(err => {
            // TODO
        })
    const toggleRun = () => isRunning ? stop(sequence.id, updateSequence) : run(sequence.id, updateSequence)
    const toggleActive = () =>
        crud?.sequenceCRUD?.update(sequence.id, { active: !sequence.active })
            .then(d => d.data && onChange(d.data))
            .catch(err => {
                // TODO
            })
    const edit = () => prompt?.newSequence((seq) => seq && onChange(seq), sequence)

    const copy = () => prompt?.newSequence(
        (seq) => seq && router.push(router.route + '/' + seq.id),
        { orders: sequence.orders }
    )

    return (
        <tr onClick={() => router.push(router.route + '/' + sequence.id)} >
            <td>
                <Text weight={'bold'}>{sequence.name}</Text>
            </td>
            <td>
                <Text >{sequence.lastRun ? new Date(sequence.lastRun).toLocaleString() : t('never_run')}</Text>
            </td>
            <td>
                <Text >{sequence.CronSequence.length ? sequence.CronSequence.length + " " + t('triggers') : t('zero_triggers')} </Text>
            </td>
            <td onClick={stopPropagation()}>
                <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                    <Group>
                        <Tooltip label={isRunning ? t('stop') : t('run')} withArrow>
                            <ActionIcon
                                variant="default"
                                onClick={toggleRun}
                            >
                                {isRunning ?
                                    <PlayerPause size={16} /> :
                                    < PlayerPlay size={16} />
                                }
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={sequence.active ? t('deactivate') : t("activate")} withArrow>
                            <ActionIcon
                                variant='default'
                                onClick={toggleActive}
                            >
                                {sequence.active ?
                                    <CalendarOff size={16} /> :
                                    <Calendar size={16} />
                                }
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('edit')} withArrow>
                            <ActionIcon
                                variant='default'
                                onClick={edit}
                            >
                                <Edit size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('copy')} withArrow>
                            <ActionIcon
                                variant='default'
                                onClick={copy}
                            >
                                <Copy size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('delete')} withArrow>
                            <ActionIcon
                                variant='default'
                                color={'red'}
                                onClick={() => remove(sequence.id)}
                            >
                                <Trash size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </MediaQuery>
                <MediaQuery largerThan={'md'} styles={{ display: 'none' }} >
                    <Menu >
                        <Menu.Label>{t("actions")}</Menu.Label>
                        <Menu.Item
                            onClick={toggleRun}
                            icon={isRunning ?
                                <PlayerPause size={16} /> :
                                < PlayerPlay size={16} />
                            }
                        >
                            {isRunning ? t("stop") : t("run")}
                        </Menu.Item>
                        <Menu.Item
                            onClick={toggleActive}
                            icon={sequence.active ?
                                <CalendarOff size={16} /> :
                                <Calendar size={16} />
                            }
                        >
                            {sequence.active ?
                                t("deactivate") :
                                t("activate")
                            }
                        </Menu.Item>
                        <Menu.Item
                            onClick={edit}
                            icon={<Edit size={16} />}
                        >
                            {t("edit")}
                        </Menu.Item>
                        <Menu.Item
                            onClick={copy}
                            icon={<Copy size={16} />}
                        >
                            {t("copy")}
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => remove(sequence.id)}
                            color={"red"}
                            icon={<Trash size={16} />}
                        >
                            {t("delete")}
                        </Menu.Item>
                    </Menu>
                </MediaQuery>
            </td>
        </tr>
    )
}


export default SequenceRow

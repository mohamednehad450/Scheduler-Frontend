import { createContext, ReactNode, useContext, useState } from "react"
import { CronDbType, SequenceDBType } from "../../../Scheduler/src/db"
import { ConfirmModal } from "../../common"
import { NewSequence } from "../../sequences"
import LinkSequence from "../../sequences/LinkSequence"
import NewCron from "../../sequences/NewCron"




type PromptContext = {
    confirm: (onDone: (confirmed: boolean) => void, message?: string) => void
    newSequence: (onDone: (newSeq: SequenceDBType) => void, initialSequence?: SequenceDBType) => void
    newCron: (onDone: (newCron: CronDbType) => void, initialCron?: CronDbType) => void
    linkSequence: (onDone: (seq: SequenceDBType) => void, sequenceId: SequenceDBType['id'], initialIds?: CronDbType['id'][],) => void
}

const promptContext = createContext<PromptContext | undefined>(undefined)

const usePrompt = () => useContext(promptContext)


const usePromptContext = (): { context: PromptContext, modal: ReactNode } => {

    const [openedConfirm, setOpenedConfirm] = useState(false)
    const [confirm, setConfirm] = useState<{ message?: string, onDone: (confirmed: boolean) => void }>()

    const [openedNewSeq, setOpenedNewSeq] = useState(false)
    const [newSeq, setNewSeq] = useState<{ initialSequence?: SequenceDBType, onDone: (seq: SequenceDBType) => void }>()

    const [openedNewCron, setOpenedNewCron] = useState(false)
    const [newCron, setNewCron] = useState<{ initialCron?: CronDbType, onDone: (cron: CronDbType) => void }>()

    const [openedLinkSequence, setOpenedLinkSequence] = useState(false)
    const [linkSequence, setLinkSequence] = useState<{ onDone: (seq: SequenceDBType) => void, sequenceId: SequenceDBType['id'], initialIds?: CronDbType['id'][] }>()

    return {
        context: {
            confirm: (onDone: (confirmed: boolean) => void, message?: string) => {
                setOpenedConfirm(true)
                setConfirm({
                    message,
                    onDone,
                })
            },
            newSequence: (onDone, initialSequence) => {
                setOpenedNewSeq(true)
                setNewSeq({ onDone, initialSequence })
            },
            newCron: (onDone: (newCron: CronDbType) => void, initialCron?: CronDbType) => {
                setOpenedNewCron(true)
                setNewCron({ onDone, initialCron })
            },
            linkSequence: (onDone: (seq: SequenceDBType) => void, sequenceId: SequenceDBType['id'], initialIds?: CronDbType['id'][]) => {
                setOpenedLinkSequence(true)
                setLinkSequence({ onDone, sequenceId, initialIds })
            },
        },
        modal: (
            <>
                <ConfirmModal
                    opened={openedConfirm}
                    onDone={(confirmed) => {
                        setOpenedConfirm(false)
                        confirm?.onDone(confirmed)
                        setConfirm(undefined)
                    }}
                    message={confirm?.message}
                />
                <NewSequence
                    onClose={(seq) => {
                        setOpenedNewSeq(false)
                        seq && newSeq?.onDone(seq)
                        setNewSeq(undefined)
                    }}
                    opened={openedNewSeq}
                    initialSequence={newSeq?.initialSequence}
                />
                <NewCron
                    opened={openedNewCron}
                    initCron={newCron?.initialCron}
                    onClose={(cron) => {
                        setOpenedNewCron(false)
                        cron && newCron?.onDone(cron)
                        setNewCron(undefined)
                    }}
                />
                <LinkSequence
                    opened={openedLinkSequence}
                    onClose={(seq) => {
                        setOpenedLinkSequence(false)
                        seq && linkSequence?.onDone(seq)
                        setLinkSequence(undefined)
                    }}
                    sequenceId={linkSequence?.sequenceId || -1}
                    initialCrons={linkSequence?.initialIds}
                />
            </>
        )
    }
}

export { usePrompt, usePromptContext, promptContext }
import { createContext, ReactNode, useContext, useState } from "react"
import { CronDbType, SequenceDBType } from "../../../Scheduler/src/db"
import { ConfirmModal, NewSequence, NewCron, LinkSequence } from "../../modals"

interface PromptArgs {
    confirm: [onDone: (confirmed: boolean) => void, message?: string]
    newSequence: [onDone: (newSeq?: SequenceDBType) => void, initialSequence?: SequenceDBType]
    newCron: [onDone: (newCron?: CronDbType) => void, initialCron?: CronDbType]
    linkSequence: [onDone: (seq?: SequenceDBType) => void, sequenceId: SequenceDBType['id'], initialIds?: CronDbType['id'][]]
}


type PromptContext = {
    confirm: (...args: PromptArgs['confirm']) => void
    newSequence: (...args: PromptArgs['newSequence']) => void
    newCron: (...args: PromptArgs['newCron']) => void
    linkSequence: (...args: PromptArgs['linkSequence']) => void
}

const promptContext = createContext<PromptContext | undefined>(undefined)

const usePrompt = () => useContext(promptContext)


const usePromptContext = (): { context: PromptContext, modal: ReactNode } => {

    const [openedConfirm, setOpenedConfirm] = useState(false)
    const [confirm, setConfirm] = useState<PromptArgs['confirm']>()

    const [openedNewSeq, setOpenedNewSeq] = useState(false)
    const [newSeq, setNewSeq] = useState<PromptArgs['newSequence']>()


    const [openedNewCron, setOpenedNewCron] = useState(false)
    const [newCron, setNewCron] = useState<PromptArgs['newCron']>()


    const [openedLinkSequence, setOpenedLinkSequence] = useState(false)
    const [linkSequence, setLinkSequence] = useState<PromptArgs['linkSequence']>()

    return {
        context: {
            confirm: (...args) => {
                setOpenedConfirm(true)
                setConfirm(args)
            },
            newSequence: (...args) => {
                setOpenedNewSeq(true)
                setNewSeq(args)
            },
            newCron: (...args) => {
                setOpenedNewCron(true)
                setNewCron(args)
            },
            linkSequence: (...args) => {
                setOpenedLinkSequence(true)
                setLinkSequence(args)
            },
        },
        modal: (
            <>
                <ConfirmModal
                    opened={openedConfirm}
                    onDone={(confirmed) => {
                        setOpenedConfirm(false)
                        confirm?.[0](confirmed)
                        setConfirm(undefined)
                    }}
                    message={confirm?.[1]}
                />
                <NewSequence
                    onClose={(seq) => {
                        setOpenedNewSeq(false)
                        newSeq?.[0](seq)
                        setNewSeq(undefined)
                    }}
                    opened={openedNewSeq}
                    initialSequence={newSeq?.[1]}
                />
                <NewCron
                    opened={openedNewCron}
                    initCron={newCron?.[1]}
                    onClose={(cron) => {
                        setOpenedNewCron(false)
                        newCron?.[0](cron)
                        setNewCron(undefined)
                    }}
                />
                <LinkSequence
                    opened={openedLinkSequence}
                    onClose={(seq) => {
                        setOpenedLinkSequence(false)
                        linkSequence?.[0](seq)
                        setLinkSequence(undefined)
                    }}
                    sequenceId={linkSequence?.[1] || -1}
                    initialCrons={linkSequence?.[2]}
                />
            </>
        )
    }
}

export { usePrompt, usePromptContext, promptContext }
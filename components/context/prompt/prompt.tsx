import { createContext, ReactNode, useContext, useState } from "react"
import { Cron, Pin, Sequence } from "../../common"
import { ConfirmModal, NewSequence, NewCron, LinkSequence, LinkCron, NewPin, ChangeSocketModal } from "../../modals"

interface PromptArgs {
    confirm: [onDone: (confirmed: boolean) => void, message?: string]
    newSequence: [onDone: (newSeq?: Sequence) => void, initialSequence?: Partial<Sequence>]
    newCron: [onDone: (newCron?: Cron) => void, initialCron?: Cron]
    newPin: [onDone: (newPin?: Pin) => void, usedPins: { [key: Pin['channel']]: true }, initialPin?: Pin]
    linkSequence: [onDone: (seq?: Sequence) => void, sequenceId: Sequence['id'], initialIds?: Cron['id'][]]
    linkCron: [onDone: (cron?: Cron) => void, cronId: Cron['id'], initialIds?: Sequence['id'][]]
}


type PromptContext = {
    confirm: (...args: PromptArgs['confirm']) => void
    newSequence: (...args: PromptArgs['newSequence']) => void
    newCron: (...args: PromptArgs['newCron']) => void
    newPin: (...args: PromptArgs['newPin']) => void
    linkSequence: (...args: PromptArgs['linkSequence']) => void
    linkCron: (...args: PromptArgs['linkCron']) => void
    changeSocket: () => void
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

    const [openedLinkCron, setOpenedLinkCron] = useState(false)
    const [linkCron, setLinkCron] = useState<PromptArgs['linkCron']>()

    const [openedNewPin, setOpenedNewPin] = useState(false)
    const [newPin, setNewPin] = useState<PromptArgs['newPin']>()

    const [openedChangeSocket, setOpenedChangeSocket] = useState(false)


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
            linkCron: (...args) => {
                setOpenedLinkCron(true)
                setLinkCron(args)
            },
            newPin: (...args) => {
                setOpenedNewPin(true)
                setNewPin(args)
            },
            changeSocket: () => {
                setOpenedChangeSocket(true)
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
                <NewPin
                    opened={openedNewPin}
                    initialPin={newPin?.[2]}
                    onClose={(pin) => {
                        setOpenedNewPin(false)
                        newPin?.[0](pin)
                        setNewPin(undefined)
                    }}
                    usedPins={newPin?.[1] || {}}
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
                <LinkCron
                    opened={openedLinkCron}
                    onClose={(cron) => {
                        setOpenedLinkCron(false)
                        linkCron?.[0](cron)
                        setLinkCron(undefined)
                    }}
                    cronId={linkCron?.[1] || -1}
                    initialSequences={linkCron?.[2]}
                />
                <ChangeSocketModal
                    opened={openedChangeSocket}
                    onDone={() => setOpenedChangeSocket(false)}
                />
            </>
        )
    }
}

export { usePrompt, usePromptContext, promptContext }
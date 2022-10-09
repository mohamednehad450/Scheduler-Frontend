import { createContext, ReactNode, useContext, useState } from "react"
import { SequenceDBType } from "../../../Scheduler/src/db"
import { ConfirmModal } from "../../common"
import { NewSequence } from "../../sequences"

type PromptContext = {
    confirm: (onDone: (confirmed: boolean) => void, message?: string) => void
    newSequence: (onDone: (newSeq: SequenceDBType) => void, initialSequence?: SequenceDBType) => void
}

const promptContext = createContext<PromptContext | undefined>(undefined)

const usePrompt = () => useContext(promptContext)


const usePromptContext = (): { context: PromptContext, modal: ReactNode } => {

    const [openedConfirm, setOpenedConfirm] = useState(false)
    const [confirm, setConfirm] = useState<{ message?: string, onDone: (confirmed: boolean) => void }>()

    const [openedNewSeq, setOpenedNewSeq] = useState(false)
    const [newSeq, setNewSeq] = useState<{ initialSequence?: SequenceDBType, onDone: (seq: SequenceDBType) => void }>()

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
            }
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
            </>
        )
    }
}

export { usePrompt, usePromptContext, promptContext }
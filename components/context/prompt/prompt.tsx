import { createContext, ReactNode, useContext, useState } from "react"
import { ConfirmModal } from "../../common"

type PromptContext = {
    confirm: (onDone: (confirmed: boolean) => void, message?: string) => void
}

const promptContext = createContext<PromptContext | undefined>(undefined)

const usePrompt = () => useContext(promptContext)


const usePromptContext = (): { context: PromptContext, modal: ReactNode } => {

    const [opened, setOpened] = useState(false)
    const [confirm, setConfirm] = useState<{ message?: string, onDone: (confirmed: boolean) => void }>()


    return {
        context: {
            confirm: (onDone: (confirmed: boolean) => void, message?: string) => {
                setOpened(true)
                setConfirm({
                    message,
                    onDone,
                })
            },
        },
        modal: (
            <ConfirmModal
                opened={opened}
                onDone={(confirmed) => {
                    setOpened(false)
                    confirm?.onDone(confirmed)
                    setConfirm(undefined)
                }}
                message={confirm?.message}
            />
        )
    }
}

export { usePrompt, usePromptContext, promptContext }
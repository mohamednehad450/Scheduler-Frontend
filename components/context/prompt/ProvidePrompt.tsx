import { FC, PropsWithChildren } from "react"
import { usePromptContext, promptContext } from "./prompt"


const ProvidePrompt: FC<PropsWithChildren<{}>> = ({ children }) => {
    const { modal, context } = usePromptContext()

    return (
        <promptContext.Provider value={context}>
            {modal}
            {children}
        </promptContext.Provider>
    )
}

export default ProvidePrompt
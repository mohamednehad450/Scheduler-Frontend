import { FC, PropsWithChildren } from "react"
import { initActionsContext, actionsContext } from "./actions"


const ProvideActions: FC<PropsWithChildren<{}>> = ({ children }) => {
    const actions = initActionsContext()

    return (
        <actionsContext.Provider value={actions}>
            {children}
        </actionsContext.Provider>
    )
}

export default ProvideActions
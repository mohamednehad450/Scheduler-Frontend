import { FC, PropsWithChildren } from "react"
import { useActionsContext, actionsContext } from "./actions"


const ProvideActions: FC<PropsWithChildren<{}>> = ({ children }) => {
    const actions = useActionsContext()

    return (
        <actionsContext.Provider value={actions}>
            {children}
        </actionsContext.Provider>
    )
}

export default ProvideActions
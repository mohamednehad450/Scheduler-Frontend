import { FC, PropsWithChildren } from "react"
import { useSequencesCRUD, sequencesContext, } from "./sequences"


const ProvideSequence: FC<PropsWithChildren<{}>> = ({ children }) => {
    const seq = useSequencesCRUD()

    return (
        <sequencesContext.Provider value={seq}>
            {children}
        </sequencesContext.Provider>
    )
}

export default ProvideSequence
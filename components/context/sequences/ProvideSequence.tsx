import { FC, PropsWithChildren } from "react"
import { initSequencesContext, sequencesContext, } from "./sequences"


const ProvideSequence: FC<PropsWithChildren<{}>> = ({ children }) => {
    const seq = initSequencesContext()

    return (
        <sequencesContext.Provider value={seq}>
            {children}
        </sequencesContext.Provider>
    )
}

export default ProvideSequence
import { FC, PropsWithChildren } from "react"
import { useCronsCRUD, cronsContext, } from "./crons"


const ProvideCron: FC<PropsWithChildren<{}>> = ({ children }) => {
    const crons = useCronsCRUD()

    return (
        <cronsContext.Provider value={crons}>
            {children}
        </cronsContext.Provider>
    )
}

export default ProvideCron
import { FC, PropsWithChildren } from "react"
import { initPinsContext, pinsContext, } from "./pins"


const ProvidePins: FC<PropsWithChildren<{}>> = ({ children }) => {
    const pins = initPinsContext()
    return (
        <pinsContext.Provider value={pins}>
            {children}
        </pinsContext.Provider>
    )
}

export default ProvidePins
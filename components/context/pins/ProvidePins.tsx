import { FC, PropsWithChildren } from "react"
import { usePinsCRUD, pinsContext, } from "./pins"


const ProvidePins: FC<PropsWithChildren<{}>> = ({ children }) => {
    const pins = usePinsCRUD()
    return (
        <pinsContext.Provider value={pins}>
            {children}
        </pinsContext.Provider>
    )
}

export default ProvidePins
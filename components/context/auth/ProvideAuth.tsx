import { FC, PropsWithChildren } from "react"
import { useAuthContext, authContext } from "./auth"

const ProvideAuth: FC<PropsWithChildren<{}>> = ({ children }) => {
    const value = useAuthContext()

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}

export default ProvideAuth
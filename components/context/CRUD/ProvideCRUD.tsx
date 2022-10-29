import { FC, PropsWithChildren } from "react"
import { useCRUDContext, crudContext } from "./crud"

const ProvideCRUD: FC<PropsWithChildren<{}>> = ({ children }) => {
    const value = useCRUDContext()

    return (
        <crudContext.Provider value={value}>
            {children}
        </crudContext.Provider>
    )
}

export default ProvideCRUD
import { FC, PropsWithChildren } from "react"
import { useSchedulesCRUD, schedulesContext, } from "./schedules"


const ProvideSchedule: FC<PropsWithChildren<{}>> = ({ children }) => {
    const schedules = useSchedulesCRUD()

    return (
        <schedulesContext.Provider value={schedules}>
            {children}
        </schedulesContext.Provider>
    )
}

export default ProvideSchedule
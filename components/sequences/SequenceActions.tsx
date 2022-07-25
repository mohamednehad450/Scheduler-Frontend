import { Text } from "@mantine/core"
import { FC } from "react"
import { SequenceDBType } from "../../Scheduler/src/db"

interface SequenceActionsProps {
    sequence: SequenceDBType
}


const SequenceActions: FC<SequenceActionsProps> = ({ sequence }) => {

    return (
        <Text>TO BE IMPLEMENTED!</Text>
    )
}

export default SequenceActions

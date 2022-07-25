import { Text } from "@mantine/core"
import { FC } from "react"
import { SequenceDBType } from "../../Scheduler/src/db"


interface SequenceActivitiesProps {
    sequence: SequenceDBType
}


const SequenceActivities: FC<SequenceActivitiesProps> = ({ sequence }) => {

    return (
        <Text>TO BE IMPLEMENTED!</Text>
    )
}

export default SequenceActivities
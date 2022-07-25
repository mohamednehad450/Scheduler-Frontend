import { Text } from "@mantine/core";
import { FC } from "react";
import { SequenceDBType } from "../../Scheduler/src/db";

interface SequenceScheduleProps {
    schedule: SequenceDBType['schedule']
}

const SequenceSchedule: FC<SequenceScheduleProps> = ({ schedule }) => {


    return (
        <Text>TO BE IMPLEMENTED!</Text>
    )
}

export default SequenceSchedule
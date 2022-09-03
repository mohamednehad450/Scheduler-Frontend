import { Button, MultiSelect } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { FC, useState } from "react"
import { CronDbType } from "../../Scheduler/src/db"
import NewCron from "./NewCron"


interface CronSelectProps {
    crons: CronDbType[]
    value: CronDbType['id'][]
    onChange: (cronsIds: CronDbType['id'][]) => void
}


const CronSelect: FC<CronSelectProps> = ({ crons: initialCrons, value, onChange }) => {

    const [crons, setCrons] = useState(initialCrons)
    const [newCron, setNewCron] = useState(false)
    const [debouncedNewCron] = useDebouncedValue(newCron, 100)

    return (
        <>
            <MultiSelect
                size="md"
                data={crons.map(c => ({ value: String(c.id), label: c.label })) || []}
                value={value.map(String)}
                label="Cron Triggers"
                placeholder="- Select Triggers"
                onChange={(cronsIds) => onChange(cronsIds.map(Number))}
            />
            <Button my="md" variant="subtle" onClick={() => setNewCron(true)}>
                Add new cron trigger
            </Button>
            {newCron && (
                <NewCron opened={debouncedNewCron} onClose={(cron) => {
                    cron && setCrons(cs => [cron, ...cs])
                    cron && onChange([...value, cron.id])
                    setNewCron(false)
                }} />
            )}
        </>
    )
}

export default CronSelect
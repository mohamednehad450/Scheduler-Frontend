import { Button, Group, Modal, MultiSelect } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { cronCRUD, cronSequence } from "../../api"
import { CronDbType, SequenceDBType } from "../../Scheduler/src/db"
import { usePrompt } from "../context"


interface LinkSequenceProps {
    opened: boolean
    onClose: (seq?: SequenceDBType) => void
    sequenceId: SequenceDBType['id']
    initialCrons?: CronDbType['id'][]
}


const LinkSequence: FC<LinkSequenceProps> = ({ opened, onClose, initialCrons, sequenceId }) => {

    const [crons, setCrons] = useState<CronDbType[]>([])
    const [cronsIds, setCronsIds] = useState<CronDbType['id'][]>(initialCrons || [])

    const prompt = usePrompt()

    useEffect(() => {
        if (opened) {
            cronCRUD.list()
                .then(({ data }) => setCrons(data))
            setCronsIds(initialCrons || [])
        }

    }, [opened])

    return (
        <Modal
            title={"Link Cron Triggers"}
            opened={opened}
            onClose={() => onClose()}
            size="lg"
            overflow="inside"
        >
            <MultiSelect
                size="md"
                data={crons.map(c => ({ value: String(c.id), label: c.label })) || []}
                value={cronsIds.map(String)}
                label="Cron Triggers"
                placeholder="- Select Triggers"
                onChange={(cronsIds) => setCronsIds(cronsIds.map(Number))}
            />
            <Button
                my="md"
                variant="subtle"
                onClick={() => {
                    onClose()
                    prompt?.newCron((cron) => {
                        prompt.linkSequence(() => { }, sequenceId, [cron.id, ...initialCrons || []])
                    })
                }}

            >
                Link a new cron trigger
            </Button>
            <Group p={'md'} position="right">
                <Button variant="subtle" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => cronSequence.linkSequencePromise(sequenceId, cronsIds).then(onClose)}
                >
                    {"Submit"}
                </Button>
            </Group>
        </Modal>
    )
}

export default LinkSequence
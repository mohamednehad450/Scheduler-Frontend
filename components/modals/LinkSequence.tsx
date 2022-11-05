import { Button, Group, Modal, MultiSelect } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { CronDbType, SequenceDBType } from "../../Scheduler/src/db"
import { useCRUD, usePrompt } from "../context"


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
    const crud = useCRUD()

    useEffect(() => {
        if (opened) {
            crud?.cronCRUD?.list()
                .then(({ data }) => setCrons(data))
            setCronsIds(initialCrons || [])
        }

    }, [opened, crud])

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
                        cron ?
                            prompt.linkSequence(onClose, sequenceId, [cron.id, ...initialCrons || []]) :
                            prompt.linkSequence(onClose, sequenceId, initialCrons)
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
                    onClick={() => crud?.cronSequence?.linkSequence(sequenceId, cronsIds).then(r => onClose(r.data))}
                >
                    {"Submit"}
                </Button>
            </Group>
        </Modal>
    )
}

export default LinkSequence
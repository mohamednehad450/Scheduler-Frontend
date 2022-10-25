import { Button, Divider, Group, Modal, MultiSelect } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { cronSequence, sequenceCRUD } from "../../api"
import { CronDbType, SequenceDBType } from "../../Scheduler/src/db"


interface LinkCronProps {
    opened: boolean
    onClose: (cron?: CronDbType) => void
    cronId: CronDbType['id']
    initialSequences?: SequenceDBType['id'][]
}


const LinkCron: FC<LinkCronProps> = ({ opened, onClose, initialSequences, cronId }) => {

    const [sequences, setSequences] = useState<SequenceDBType[]>([])
    const [sequencesIds, setSequencesIds] = useState<SequenceDBType['id'][]>(initialSequences || [])

    useEffect(() => {
        if (opened) {
            sequenceCRUD.list()
                .then(({ data }) => setSequences(data))
            setSequencesIds(initialSequences || [])
        }

    }, [opened])

    return (
        <Modal
            title={"Link Sequences to Cron Triggers"}
            opened={opened}
            onClose={() => onClose()}
            size="lg"
            overflow="inside"
        >
            <MultiSelect
                size="md"
                data={sequences.map(c => ({ value: String(c.id), label: c.name })) || []}
                value={sequencesIds.map(String)}
                label="Sequences"
                placeholder="- Select Sequences"
                onChange={(SequencesIds) => setSequencesIds(SequencesIds.map(Number))}
            />
            <Group p={'md'} position="right">
                <Button variant="subtle" onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => cronSequence.linkCronPromise(cronId, sequencesIds).then(onClose)}
                >
                    {"Submit"}
                </Button>
            </Group>
        </Modal>
    )
}

export default LinkCron
import { Button, Group, Modal, MultiSelect } from "@mantine/core"
import { FC, useEffect, useState } from "react"
import { Cron, Sequence } from "../common"
import { useCRUD } from "../context"


interface LinkCronProps {
    opened: boolean
    onClose: (cron?: Cron) => void
    cronId: Cron['id']
    initialSequences?: Sequence['id'][]
}


const LinkCron: FC<LinkCronProps> = ({ opened, onClose, initialSequences, cronId }) => {

    const [sequences, setSequences] = useState<Sequence[]>([])
    const [sequencesIds, setSequencesIds] = useState<Sequence['id'][]>(initialSequences || [])

    const crud = useCRUD()

    useEffect(() => {
        if (opened) {
            crud?.sequenceCRUD?.list()
                .then(({ data }) => setSequences(data))
            setSequencesIds(initialSequences || [])
        }

    }, [opened, crud])

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
                    onClick={() => crud?.cronSequence?.linkCron(cronId, sequencesIds).then((r) => onClose(r.data))}
                >
                    {"Submit"}
                </Button>
            </Group>
        </Modal>
    )
}

export default LinkCron
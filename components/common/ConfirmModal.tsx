import { Button, Modal, Group } from "@mantine/core"
import { FC, PropsWithChildren } from "react"


const ConfirmModal: FC<PropsWithChildren<{ onDone: (confirm: boolean) => void, opened: boolean, message?: string }>> = ({ onDone, opened, message }) => {
    return (
        <Modal
            opened={opened}
            onClose={() => onDone(false)}
            title={message || "Are you sure?"}
            centered
        >
            <Group position="right" mt="lg">
                <Button
                    variant="subtle"
                    color={'gray'}
                    onClick={() => onDone(false)}

                >
                    Cancel
                </Button>
                <Button
                    variant="light"
                    color={'red'}
                    onClick={() => onDone(true)}
                >
                    Confirm
                </Button>
            </Group>
        </Modal>
    )
}

export default ConfirmModal


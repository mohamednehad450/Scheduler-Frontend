import { Button, Modal, Group } from "@mantine/core"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"


const ConfirmModal: FC<PropsWithChildren<{ onDone: (confirm: boolean) => void, opened: boolean, message?: string }>> = ({ onDone, opened, message: initMessage }) => {

    const [message, setMessage] = useState(initMessage)

    const { t } = useTranslation()

    useEffect(() => {
        if (opened) setMessage(initMessage)
    }, [opened])
    return (
        <Modal
            opened={opened}
            onClose={() => onDone(false)}
            title={message || t("are_you_sure")}
            centered
        >
            <Group position="right" mt="lg">
                <Button
                    variant="subtle"
                    color={'gray'}
                    onClick={() => onDone(false)}

                >
                    {t('cancel')}
                </Button>
                <Button
                    variant="light"
                    color={'red'}
                    onClick={() => onDone(true)}
                >
                    {t('confirm')}
                </Button>
            </Group>
        </Modal>
    )
}

export default ConfirmModal


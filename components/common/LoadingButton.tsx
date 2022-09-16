import { Button, LoadingOverlay, ButtonProps, Modal, Group, Text, Divider, Space } from "@mantine/core"
import { FC, PropsWithChildren, useState } from "react"


const LoadingButton: FC<PropsWithChildren<ButtonProps<any> & { onClick?: (onDone: () => void) => void, confirm?: boolean }>> = (props) => {
    const [loading, setLoading] = useState(false)
    const [confirmPrompt, setConfirmPrompt] = useState(false)
    return (
        <>
            <Button {...props} onClick={() => {
                if (!props.onClick) return
                if (props.confirm) {
                    setConfirmPrompt(true)
                }
                else {
                    setLoading(true)
                    props.onClick(() => setLoading(false))
                }
            }}>
                {props.children}
                <LoadingOverlay visible={loading} />
            </Button>
            {props.confirm && props.onClick && (
                <Modal
                    opened={confirmPrompt}
                    onClose={() => setConfirmPrompt(false)}
                    title="Are you sure?"
                    styles={{ header: { borderBottom: '1px solid #ced4da' } }}
                    centered
                >

                    <Group>
                        <Button
                            color={'gray'}
                            onClick={() => {
                                setLoading(() => false)
                                setConfirmPrompt(() => false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={'red'}
                            onClick={() => {
                                setConfirmPrompt(false)
                                setLoading(true)
                                props.onClick && props.onClick(() => setLoading(false))
                            }}
                        >
                            Confirm
                        </Button>
                    </Group>
                </Modal>
            )}
        </>
    )
}

export default LoadingButton


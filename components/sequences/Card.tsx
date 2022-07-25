import { Card as _Card, Container, Divider, Group, ScrollArea, Text } from '@mantine/core'
import { FC, ReactNode } from 'react'

const Card: FC<{ title: string, body: ReactNode, footer?: ReactNode }> = ({ title, body, footer }) => {

    return (
        <_Card shadow="sm" p="xs" radius={'md'} style={{ height: '18rem', }}>
            <Container my="0" px="sm" py="0" style={{ height: '17rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }} >
                <Group pt="sm" style={{ display: 'block' }}>
                    <Text weight={500} size='xl'>{title}</Text>
                </Group>
                <Divider />
                <ScrollArea styles={{ root: { flex: 4 } }} py="xs" m="0" p="0">
                    {body}
                </ScrollArea>
                {footer &&
                    <Group style={{ flex: 1 }}>
                        {footer}
                    </Group>
                }
            </Container>
        </_Card>
    )
}

export default Card
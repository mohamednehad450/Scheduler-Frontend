import { Divider, Group, Text, ThemeIcon } from "@mantine/core";
import { FC } from "react";
import { Circle } from "tabler-icons-react";


const PinStatusRow: FC<{ label: string, running: boolean }> = ({ label, running }) => {
    return (
        <>
            <Group p={'xs'} position="apart">
                <Text size="sm">{label}</Text>
                <ThemeIcon radius={"lg"} mx="sm" size={12} color={running ? 'green' : 'red'}>
                    <Circle stroke="0" />
                </ThemeIcon>
            </Group>
            <Divider />
        </>
    )
}


export default PinStatusRow
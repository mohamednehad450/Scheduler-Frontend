import { Divider, ScrollArea } from "@mantine/core";
import { FC, ReactNode } from "react";

const ScrollList: FC<{ body: ReactNode, footer?: ReactNode, empty?: ReactNode }> = ({ body, footer, empty }) => {

    return (
        <>
            <ScrollArea style={{ height: footer ? '11rem' : '13rem' }}>
                {body || empty}
            </ScrollArea>
            {footer && (
                <>
                    <Divider />
                    {footer}
                </>
            )}
        </>
    )
}

export default ScrollList
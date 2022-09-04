import { Divider, ScrollArea } from "@mantine/core";
import { FC, ReactNode } from "react";

const ScrollList: FC<{ body: ReactNode, footer?: ReactNode, empty?: ReactNode }> = ({ body, footer, empty }) => {

    return (
        <>
            <ScrollArea style={{ height: footer ? '11rem' : '13rem' }}>
                {body || (
                    <div style={{ height: footer ? '11rem' : '13rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} >{empty}</div>
                )}
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
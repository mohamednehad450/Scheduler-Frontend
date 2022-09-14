import { FC } from 'react'
import { SequenceDBType } from '../../Scheduler/src/db'
import { Container, Divider, Group, MediaQuery, ScrollArea, Text, useMantineTheme } from '@mantine/core'
import { scaleBand, scaleLinear } from 'd3-scale'
import PeriodMark from './PeriodMark'
import PeriodTrack from './PeriodTrack'
import PeriodTicks from './PeriodTicks'

interface OrdersPreviewProps {
    orders: SequenceDBType['orders']
}


const OrdersPreview: FC<OrdersPreviewProps> = ({ orders }) => {

    const theme = useMantineTheme()

    const marksWidthPercentage = 80
    const rowHeight = 24

    const maxX = Math.max(...orders.map(o => o.offset + o.duration))
    const xScale = scaleLinear()
        .domain([0, maxX])
        .range([0, 100])


    const channels = new Map<number, string>()
    orders.forEach(o => channels.set(o.channel, o.Pin.label))

    const maxY = channels.size * rowHeight
    const yScale = scaleBand<number>()
        .domain([...channels.keys()])
        .range([0, maxY])
        .paddingInner(0.65)
        .paddingOuter(0.25)


    const offset = <T extends { offset: number }>(o: T) => o.offset
    const duration = <T extends { duration: number }>(o: T) => o.duration
    const channel = <T extends { channel: number }>(o: T) => o.channel

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <Group pt="xs">
                <Text size="xl">Orders Preview</Text>
            </Group>
            <Divider />
            <ScrollArea pt="xs" styles={{ root: { flex: 1 } }}>
                <svg width={`97%`} style={{ overflow: 'visible' }} height={maxY + yScale.bandwidth()}>
                    <MediaQuery smallerThan={'xs'} styles={{ fontSize: theme.fontSizes.xs }}>
                        <g>
                            {[...channels.entries()].map(([c, label]) => (
                                <foreignObject
                                    key={c}
                                    width={100 - marksWidthPercentage + "%"}
                                    height={rowHeight}
                                    x={0}
                                    y={(yScale(c) || 0) - (yScale.bandwidth())}
                                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                                >
                                    <Text style={{
                                        lineHeight: rowHeight + "px",
                                        fontSize: "inherit",
                                        overflow: 'clip',
                                        textOverflow: 'ellipsis'
                                    }}
                                    >
                                        {label}
                                    </Text>
                                </foreignObject>
                            ))}
                        </g>
                    </MediaQuery>
                    <svg
                        x={(100 - marksWidthPercentage) + '%'}
                        width={marksWidthPercentage + "%"}
                        style={{ overflow: 'visible' }} >
                        {[...channels.keys()].map(c => (
                            <PeriodTrack yScale={yScale} xScale={xScale} yValue={c} key={c} />
                        ))}

                        {orders.map(order => (
                            <PeriodMark
                                item={order}
                                x1Value={offset}
                                x2Value={duration}
                                yValue={channel}
                                xScale={xScale}
                                yScale={yScale}
                                key={order.id}
                            />
                        ))}
                        <PeriodTicks {...{ xScale, yScale }} />
                    </svg>
                </svg>
            </ScrollArea>
        </Container>
    )
}


export default OrdersPreview
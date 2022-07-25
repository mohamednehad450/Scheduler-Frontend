import { useMantineTheme } from '@mantine/core'
import { ScaleBand, ScaleLinear } from 'd3-scale'

interface PeriodMarkProps<T> {
    item: T,
    xScale: ScaleLinear<number, number>
    x1Value: (item: T) => number
    x2Value: (item: T) => number
    yScale: ScaleBand<number>
    yValue: (item: T) => number

}

function PeriodMark<T extends Object>({ item, x1Value, x2Value, xScale, yValue, yScale }: PeriodMarkProps<T>) {
    const theme = useMantineTheme()

    const x = xScale(x1Value(item)) + "%"
    const width = xScale(x2Value(item)) + "%"

    const height = yScale.bandwidth()
    const y = yScale(yValue(item))
    return (
        <g>
            <rect
                width={width}
                height={height}
                x={x}
                y={y}
                fill={theme.colors.blue[7]}
                rx={yScale.bandwidth() / 2}
            />
        </g>
    )
}

export default PeriodMark
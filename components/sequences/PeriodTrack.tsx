import { useMantineTheme } from "@mantine/core"
import { ScaleBand, ScaleLinear } from "d3-scale"


interface PeriodTrackProps {
    xScale: ScaleLinear<number, number>
    yScale: ScaleBand<number>
    yValue: number
}

function PeriodTrack({ xScale, yScale, yValue }: PeriodTrackProps) {

    const theme = useMantineTheme()

    return (
        <g>
            <rect
                width={xScale.range()[1] + "%"}
                height={yScale.bandwidth()}
                x={xScale(0) + "%"}
                y={yScale(yValue)}
                fill={theme.colors.gray[3]}
                rx={yScale.bandwidth() / 2}
            />
            {xScale.ticks().map((t, i) => i !== 0 && (
                <circle
                    key={t}
                    cx={xScale(t) + "%"}
                    cy={(yScale(yValue) || 0) + yScale.bandwidth() / 2}
                    fill="white"
                    r={yScale.bandwidth() / 3}
                ></circle>
            ))}

        </g>
    )
}

export default PeriodTrack
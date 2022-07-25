import { MediaQuery, useMantineTheme } from "@mantine/core"
import { ScaleBand, ScaleLinear } from "d3-scale"
import { FC } from "react"

const FormatTime = (ms: number) => {
    const t = ms / 1000
    const s = Math.floor(t % 60)
    const m = Math.floor(t / 60)
    return `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`
}


interface PeriodTicksProps {
    xScale: ScaleLinear<number, number>
    yScale: ScaleBand<number>
}


const PeriodTicks: FC<PeriodTicksProps> = ({ xScale, yScale }) => {
    const theme = useMantineTheme()
    return (
        <g>
            {xScale.ticks().map((t, i) => i % 2 === 0 ? (
                <text
                    textAnchor='middle'
                    style={{ fontSize: theme.fontSizes.xs }}
                    fill={theme.colors.gray[7]}
                    x={xScale(t) + "%"}
                    y={yScale.range()[1] + yScale.bandwidth()}
                >
                    {FormatTime(t)}
                </text>
            ) : (
                <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                    <text
                        textAnchor='middle'
                        style={{ fontSize: theme.fontSizes.xs }}
                        fill={theme.colors.gray[7]}
                        x={xScale(t) + "%"}
                        y={yScale.range()[1] + yScale.bandwidth()}
                    >
                        {FormatTime(t)}
                    </text>
                </MediaQuery>
            ))}
        </g>
    )
}

export default PeriodTicks

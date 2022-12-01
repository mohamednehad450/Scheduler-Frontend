import { ActionIcon, Group, Space, Text, useMantineTheme } from "@mantine/core"
import { useMove, } from "@mantine/hooks"
import { scaleBand, scaleLinear } from "d3-scale"
import { FC, useEffect, useRef } from "react"
import { Minus, Plus } from "tabler-icons-react"
import { PeriodMark, PeriodTrack } from "../sequences"


type Value = [number, number]

interface TrackInputProps {
    value: Value[]
    onChange: (vs: Value[]) => void
    onChangeEnd?: (vs: Value[]) => void
    step?: number
    label: string
    description?: string
    formatTooltip?: (v: number) => string
}

const TRACK_HEIGHT = 16
const { abs, floor, round } = Math


const TrackInput: FC<TrackInputProps> = ({
    value,
    onChange,
    onChangeEnd,
    step = 0.01,
    label,
    description,
    formatTooltip,
}) => {

    const theme = useMantineTheme()
    const activeIndex = useRef<[number, number]>()

    const { ref, active } = useMove(({ x }) => {


        const adjustX = theme.dir === "ltr" ? x : 1 - x
        // Setting active Thump
        if (!activeIndex.current) {
            const flat = value.flatMap(([x1, x2]) => [abs(x1 - adjustX), abs(x2 - adjustX)])
            let minIndex = 0
            flat.forEach((n, i) => {
                if (n <= flat[minIndex]) {
                    minIndex = i
                }
            })
            activeIndex.current = [floor(minIndex / 2), minIndex % 2]
        }


        const [index, sub] = activeIndex.current

        // First thump
        if (sub === 0) {
            const length = value[index][1] - adjustX
            // Prevent collision with the thump before it
            if ((index > 0) && (value[index - 1][1] + step > adjustX)) {
                value[index][0] = value[index - 1][1] + step

            }
            // min length = step
            else if (length < step) {
                value[index][0] = value[index][1] - step
            }
            // Moving on step at a time
            else {
                value[index][0] = round(adjustX / step) * step
            }
        }
        // Second thump
        if (sub === 1) {
            const length = adjustX - value[index][0]
            // Prevent collision with the thump after it
            if ((index < value.length - 1) && (value[index + 1][0] - step < adjustX)) {
                value[index][1] = value[index + 1][0] - step
            }
            // min length = step
            else if (length < step) {
                value[index][1] = value[index][0] + step
            }
            // Moving on step at a time
            else {
                value[index][1] = round(adjustX / step) * step
            }
        }

        onChange([...value])
    })

    // Clearing active thump
    useEffect(() => {
        activeIndex.current = undefined
        if (!active) {
            onChangeEnd && onChangeEnd(value)
        }
    }, [active])


    const x1Value = (v: Value) => v[0]
    const x2Value = (v: Value) => v[1]


    const maxX = 1
    const xScale = scaleLinear()
        .domain([0, maxX])
        .range(theme.dir === 'ltr' ? [0, 100] : [100, 0])


    const maxY = TRACK_HEIGHT
    const yScale = scaleBand<number>()
        .domain([0])
        .range([0, maxY])
        .paddingInner(0.65)



    return (
        <div>
            <Group px="md" position="apart">
                <Group style={{ gap: 0 }} direction="column">
                    <Text size="sm" weight={500}>{label}</Text>
                    <Text size="xs" color={theme.colors.gray[6]} weight={500}>{description}</Text>
                </Group>
                <Group style={{ zIndex: active ? -1 : 0 }}>

                    <ActionIcon size={20} variant="light" onClick={() => {
                        activeIndex.current = undefined
                        value.pop()
                        onChange(value)
                        onChangeEnd && onChangeEnd(value)
                    }} >
                        <Minus />
                    </ActionIcon>
                    <Space />
                    <ActionIcon size={20} variant="light" onClick={() => {
                        activeIndex.current = undefined
                        if (!value.length) {
                            value.push([0, 0.1])
                            onChange(value)
                            onChangeEnd && onChangeEnd(value)
                            return
                        }
                        const last = value[value.length - 1]
                        if (last[1] + 0.05 < 0.9) {
                            value.push([last[1] + 0.05, last[1] + 0.05 + 0.1])
                            onChange(value)
                            onChangeEnd && onChangeEnd(value)
                            return
                        } else {
                            const newValue: Value[] = value.map(v => [v[0] * (0.89), v[1] * (0.89)])
                            newValue.push([0.9, 1])
                            onChange(newValue)
                            onChangeEnd && onChangeEnd(newValue)
                        }
                    }} >
                        <Plus />
                    </ActionIcon>

                </Group>
            </Group>
            <div
                style={{
                    margin: `0 ${theme.spacing.xl}px`,
                }}
            >
                <div
                    ref={ref}
                    style={{
                        width: '100%',
                        overflow: 'visible'
                    }}
                >
                    <svg width={'100%'} height={TRACK_HEIGHT}
                        style={{ overflow: 'visible' }}
                    >
                        <PeriodTrack
                            xScale={xScale}
                            yScale={yScale}
                            yValue={0}
                        />
                        {value.map((v, i) => (
                            <PeriodMark
                                key={i}
                                item={v}
                                showThump
                                x1Value={x1Value}
                                x2Value={x2Value}
                                yScale={yScale}
                                xScale={xScale}
                                yValue={() => 0}
                            />
                        ))}
                        {formatTooltip && activeIndex.current && active && (
                            <>
                                <rect
                                    y={-24}
                                    style={{
                                        transform: 'translate(-32px, 0)',
                                        zIndex: 1,
                                    }}
                                    x={`${xScale(value[activeIndex.current[0]][activeIndex.current[1]])}%`}
                                    width={'64'}
                                    height={24}
                                    fill={theme.colors.gray[8]}
                                    rx={3}
                                />
                                <text
                                    textAnchor="middle"
                                    fill={theme.colors.gray[1]}
                                    fontWeight={0} fontSize={12}
                                    y={-8}
                                    x={`${xScale(value[activeIndex.current[0]][activeIndex.current[1]])}%`}
                                    style={{
                                        zIndex: 1,
                                    }}
                                >
                                    {formatTooltip(value[activeIndex.current[0]][activeIndex.current[1]])}
                                </text>
                            </>
                        )}
                    </svg>
                </div>
            </div>
        </div>
    )
}


export default TrackInput
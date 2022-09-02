import { ActionIcon, Group, Select, } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Plus } from "tabler-icons-react";
import { PinDbType } from "../../Scheduler/src/db";
import DurationInput from "./DurationInput";
import TrackInput from "./TrackInput";

export type OrderInput = {
    channel: PinDbType['channel']
    duration: number
    offset: number
}


interface OrdersInputProps {
    orders: OrderInput[],
    pins: PinDbType[]
    onChange: (os: OrderInput[]) => void
    error?: string
}


const { round } = Math

const formatDuration = (ms: number) => {
    if (ms < 1) return '00:00'
    if (ms <= 1000) return Math.round(ms) + " ms"
    const t = ms / 1000
    const cm = Math.floor((ms % 1000) / 10)
    const s = Math.floor(t % 60)
    const m = Math.floor(t / 60)
    return `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}.${cm > 9 ? cm : '0' + cm}`
}

const formatTimeLabel = (ms: number): string => {
    if (!ms) return '0'
    if (ms < 1000) return `${ms} ms`
    if (ms < 1000 * 60) return `${round(ms / 1000)} Seconds`
    if (ms < 1000 * 60 * 60) return `${round(ms / (1000 * 60))} Minutes`
    return `${round(ms / (1000 * 60 * 60))} Hours`

}

const update = (map: { [key: PinDbType['channel']]: [number, number][] }, maxX: number): OrderInput[] =>
    [...Object.keys(map)]
        .flatMap((channel) =>
            map[Number(channel)].map(([x1, x2]) => ({ channel: Number(channel), duration: Math.round((x2 - x1) * maxX), offset: Math.round(x1 * maxX) })));


const defaultSequenceLength = [
    { value: String(1000), label: '1 Second' },
    { value: String(1000 * 60), label: '1 Minute' },
    { value: String(1000 * 60 * 30), label: '30 Minute' },
    { value: String(1000 * 60 * 60), label: '1 Hour' },
]

const steps = [
    { value: String(10), label: '10 ms' },
    { value: String(100), label: '100 ms' },
    { value: String(500), label: '500 ms' },
    { value: String(1000), label: '1 Second' },
    { value: String(10000), label: '10 Seconds' },
    { value: String(15000), label: '15 Seconds' },
    { value: String(30000), label: '30 Seconds' },
    { value: String(1000 * 60), label: '1 Minute' },
]

const sortOrder = (a: [number, number], b: [number, number]) => a[0] > b[0] ? 1 : -1

const OrdersInput: FC<OrdersInputProps> = ({ orders, onChange, error, pins }) => {


    const [channelMap, setChannelMap] = useState<{ [key: PinDbType['channel']]: [number, number][] }>({})
    const [maxX, setMaxX] = useState(Math.max(...(orders.length ? orders.map(o => o.duration + o.offset) : [30 * 60 * 1000])))
    const [step, setStep] = useState(1000)
    const [sequenceLength, setSequenceLength] = useState<{ value: string, label: string }[]>([...defaultSequenceLength])
    const [customLength, setCustomLength] = useState(false)




    // Sort orders by channel 
    useEffect(() => {
        const map: { [key: PinDbType['channel']]: [number, number][] } = {}
        orders.forEach(o => {
            if (map[o.channel]) {
                map[o.channel] = map[o.channel].concat([[o.offset / maxX, (o.offset + o.duration) / maxX]]).sort(sortOrder)
            } else {
                map[o.channel] = [[o.offset / maxX, (o.offset + o.duration) / maxX]]
            }
        });
        setChannelMap(map)
    }, [orders])


    // Update SequenceLength with Custom lengths
    useEffect(() => {
        if (!sequenceLength.some(({ value }) => value === String(maxX))) {
            setSequenceLength([...defaultSequenceLength, { value: String(maxX), label: `Custom - ${formatTimeLabel(maxX)}` }])
        } else setSequenceLength([...defaultSequenceLength])
    }, [maxX])



    return (
        <div>

            <Group p="xs">
                <Group>
                    <Select
                        styles={{ root: { width: '50%' } }}
                        label={`Sequence Length`}
                        value={String(maxX)}
                        data={sequenceLength}
                        onChange={v => {
                            const length = Number(v)
                            setMaxX(length)
                            // Make sure step is at most half of the length
                            const newStep = (length / 2) < step ?
                                Number([...steps].reverse().find(({ value }) => Number(value) <= (length / 2))?.value || 10) :
                                undefined
                            newStep && setStep(newStep)
                            onChange(update(channelMap, length))
                        }}
                        rightSection={(
                            <ActionIcon size={"sm"} color="gray" onClick={() => setCustomLength(true)}>
                                <Plus />
                            </ActionIcon>
                        )}
                    />

                    <Select
                        styles={{ root: { width: '40%' } }}
                        label={'Step'}
                        value={String(step)}
                        data={steps}
                        onChange={(v) => {
                            const c = Number(v)
                            if (isNaN(c) || maxX * 0.5 < c) return
                            setStep(c)
                        }}
                        rightSectionWidth={0}
                        rightSection={(<></>)}
                    />
                </Group>
                <Select
                    styles={{ root: { minWidth: '25%' } }}
                    label={'Channels'}
                    value=""
                    data={pins.filter((p) => !channelMap[p.channel]).map(p => ({ value: String(p.channel), label: p.label })) || []}
                    placeholder=" - Add Channel"
                    onChange={(v) => {
                        const c = Number(v)
                        if (isNaN(c)) return
                        setChannelMap(old => ({ ...old, [c]: [[0, 0.1]] }))
                    }}
                    rightSection={(<></>)}
                    rightSectionWidth={0}
                    error={error}
                />
            </Group>
            {[...Object.keys(channelMap)].map((channel) => (
                <TrackInput
                    key={channel}
                    value={channelMap[Number(channel)]}
                    onChange={vs => {
                        setChannelMap(old => ({ ...old, [Number(channel)]: vs }))
                    }}
                    onChangeEnd={vs => {
                        setChannelMap({ ...channelMap, [Number(channel)]: vs })
                        onChange(update({ ...channelMap, [Number(channel)]: vs }, maxX))
                    }}
                    label={pins.find(({ channel: c }) => c === Number(channel))?.label || ''}
                    description={'Channel: ' + channel}
                    formatTooltip={v => formatDuration(round(v * maxX))}
                    step={step / maxX}
                />
            ))}
            <DurationInput
                opened={customLength}
                onClose={() => setCustomLength(false)}
                onSubmit={ms => {
                    setMaxX(ms)
                    setCustomLength(false)
                }}
            />
        </div>
    )
}


export default OrdersInput
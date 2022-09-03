import { Group, MultiSelect, NumberInput, RadioGroup, Radio, RangeSlider, Select } from "@mantine/core"
import { FC, useEffect, useState } from "react"

interface CronInputProps {
    label: string,
    min: number,
    max: number,
    formatLabel?: (n: number) => string,
    initialValue: string,
    onChange: (s: string) => void
}

type CronType = '*' | 'range' | "step" | 'collection'

const getCronType = (name: string): { value: CronType, label: string }[] => [
    { value: "*", label: 'Every ' + name, },
    { value: "range", label: 'Range of ' + name, },
    { value: "step", label: 'Every x ' + name, },
    { value: "collection", label: 'Specific ' + name, },
]

const getRange = (start: number, finish: number, formatLabel: (n: number) => string = String): { value: string, label: string }[] =>
    [...Array(finish - start + 1)].map((_, i) => ({ value: String(i + start), label: formatLabel(i + start) }));


const getTypeFromCron = (cron: string) => {
    if (cron === '*') return "*"
    if (cron.split('/').length === 2) return 'step'
    if (cron.split('-').length === 2) return 'range'
    return 'collection'
}
const getRangeFromCron = (cron: string): [number, number] | undefined => {
    const r = cron.split('-').map(Number)
    if (r.length === 2) return [r[0], r[1]]
}
const getStepFromCron = (cron: string): { start: number, step: number } | undefined => {
    const s = cron.split('/').map(Number)
    if (s.length === 2) return { start: s[0], step: s[1] }
}
const getCollectionFromCron = (cron: string): number[] | undefined => {
    const col = cron.split(',').map(Number)
    if (!isNaN(col.reduce((acc, val) => acc + val, 0))) return [...col]
}



const CronInput: FC<CronInputProps> = ({
    label,
    min,
    max,
    formatLabel = String,
    initialValue,
    onChange,
}) => {

    const [type, setType] = useState(getTypeFromCron(initialValue))
    const [range, setRange] = useState<[number, number]>(getRangeFromCron(initialValue) || [min, max])
    const [step, setStep] = useState<{ start: number, step: number }>(getStepFromCron(initialValue) || { start: 0, step: 1 })
    const [collection, setCollection] = useState<number[]>(getCollectionFromCron(initialValue) || [min])

    useEffect(() => {
        let str = ''
        switch (type) {
            case '*':
                str = '*'
                break;
            case 'range':
                str = range.join('-')
                break;
            case 'step':
                str = step.start + "/" + step.step
                break;
            case 'collection':
                str = collection.join(',')
                break;
        }
        onChange(str);

    }, [type, range, step, collection, onChange])

    return (
        <>
            <RadioGroup
                label={label}
                required
                value={type}
                onChange={setType}
                p="md"
            >
                {getCronType(label).map(({ value, label }) => (
                    <Radio value={value} label={label} />
                ))}
            </RadioGroup>
            {type === 'range' ?
                (
                    <RangeSlider
                        p="md"
                        value={range}
                        onChange={setRange}
                        min={min}
                        max={max}
                        minRange={1}
                        step={1}
                        label={formatLabel}
                    />
                ) :
                type === "step" ?
                    (
                        <Group p="md" pt="0">
                            <Select
                                style={{ width: "10rem" }}
                                label="Start"
                                data={getRange(min, max, formatLabel)}
                                value={String(step.start)}
                                onChange={(v) => setStep(s => ({ ...s, start: Number(v) }))}
                            />
                            <NumberInput
                                label="Step"
                                hideControls
                                style={{ width: "4rem" }}
                                min={0}
                                max={max}
                                value={step.step}
                                multiple
                                onChange={step => step && setStep(s => ({ ...s, step }))}
                            />
                        </Group>
                    ) :
                    type === "collection" ?
                        (
                            <MultiSelect
                                value={collection.map(String)}
                                onChange={vs => vs.length && setCollection(vs.map(Number))}
                                p="md"
                                data={getRange(min, max, formatLabel)}
                            />
                        ) :
                        null
            }
        </>
    )
}

export default CronInput

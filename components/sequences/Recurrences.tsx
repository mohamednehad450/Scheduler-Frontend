import { Text } from "@mantine/core"
import later, { Recurrence } from "later"
import { FC, ReactNode } from "react"

const scheduleLabels: { [key: keyof Recurrence]: string } = {
    t: 'Time from midnight',
    s: 'Seconds in a minute',
    m: "Minutes in an hour",
    h: 'Hours in a day',
    D: "Day of a month",
    dw: "Day of week",
    dy: "Day of year",
    wm: 'Week in a month',
    wy: "ISO weeks in a Year",
    M: "Month in a year",
    Y: "Year",
    t_a: "After Time from midnight",
    s_a: 'After Seconds in a minute',
    m_a: "After Minutes in an hour",
    h_a: 'After Hours in a day',
    D_a: "After Day of a month",
    dw_a: "After Day of week",
    dy_a: "After Day of year",
    wm_a: 'After Week in a month',
    wy_a: "After ISO weeks in a Year",
    M_a: "After Month in a year",
    Y_a: "After Year",
    t_b: "Before Time from midnight",
    s_b: 'Before Seconds in a minute',
    m_b: "Before Minutes in an hour",
    h_b: 'Before Hours in a day',
    D_b: "Before Day of a month",
    dw_b: "Before Day of week",
    dy_b: "Before Day of year",
    wm_b: 'Before Week in a month',
    wy_b: "Before ISO weeks in a Year",
    M_b: "Before Month in a year",
    Y_b: "Before Year",
}

const flatRecurrence = (rs: later.Recurrence[]) => {
    const result: later.Recurrence = {}
    rs.forEach(r => {
        [...Object.keys(r)].map(k => {
            if (result[k]) {
                result[k] = result[k]?.concat(r[k] || []).sort()
            }
            else {
                result[k] = r[k]
            }
        })
    })
    return result
}

const Recurrences: FC<{ recurrences?: later.Recurrence[], empty?: ReactNode }> = ({ recurrences, empty }) => {
    if (!recurrences) return (<>{empty}</>)
    const rs = flatRecurrence(recurrences)

    return (
        <>
            {[...Object.keys(rs)].map((k) => (<Text key={k} m="0" px="sm" >{scheduleLabels[k]}: {rs[k]?.join(' - ')}</Text>))}
        </>
    )
}


export default Recurrences
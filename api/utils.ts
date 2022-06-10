import axios from "axios"

type Callback<T> = (err: unknown, val?: T) => void

// later.js schedule type
interface ScheduleData {
    /**
     * A list of recurrence information as a composite schedule.
     */
    schedules: Recurrence[];

    /**
     * A list of exceptions to the composite recurrence information.
     */
    exceptions: Recurrence[];

    /**
     * A code to identify any errors in the composite schedule and exceptions.
     * The number tells you the position of the error within the schedule.
     */
    error: number;
}

interface Recurrence {
    /** Time in seconds from midnight. */
    t?: number[] | undefined;
    /** Seconds in minute. */
    s?: number[] | undefined;
    /** Minutes in hour. */
    m?: number[] | undefined;
    /** Hour in day. */
    h?: number[] | undefined;
    /** Day of the month. */
    D?: number[] | undefined;
    /** Day in week. */
    dw?: number[] | undefined;
    /** Nth day of the week in month. */
    dc?: number[] | undefined;
    /** Day in year. */
    dy?: number[] | undefined;
    /** Week in month. */
    wm?: number[] | undefined;
    /** ISO week in year. */
    wy?: number[] | undefined;
    /** Month in year. */
    M?: number[] | undefined;
    /** Year. */
    Y?: number[] | undefined;

    /** After modifiers. */
    t_a?: number[] | undefined;
    /** After modifiers. */
    s_a?: number[] | undefined;
    /** After modifiers. */
    m_a?: number[] | undefined;
    /** After modifiers. */
    h_a?: number[] | undefined;
    /** After modifiers. */
    D_a?: number[] | undefined;
    /** After modifiers. */
    dw_a?: number[] | undefined;
    /** After modifiers. */
    dc_a?: number[] | undefined;
    /** After modifiers. */
    dy_a?: number[] | undefined;
    /** After modifiers. */
    wm_a?: number[] | undefined;
    /** After modifiers. */
    wy_a?: number[] | undefined;
    /** After modifiers. */
    M_a?: number[] | undefined;
    /** After modifiers. */
    Y_a?: number[] | undefined;

    /** Before modifiers. */
    t_b?: number[] | undefined;
    /** Before modifiers. */
    s_b?: number[] | undefined;
    /** Before modifiers. */
    m_b?: number[] | undefined;
    /** Before modifiers. */
    h_b?: number[] | undefined;
    /** Before modifiers. */
    D_b?: number[] | undefined;
    /** Before modifiers. */
    dw_b?: number[] | undefined;
    /** Before modifiers. */
    dc_b?: number[] | undefined;
    /** Before modifiers. */
    dy_b?: number[] | undefined;
    /** Before modifiers. */
    wm_b?: number[] | undefined;
    /** Before modifiers. */
    wy_b?: number[] | undefined;
    /** Before modifiers. */
    M_b?: number[] | undefined;
    /** Before modifiers. */
    Y_b?: number[] | undefined;
}

type Pin = {
    id: number,
    channel: number,
    label: string,
    onState: "HIGH" | "LOW",
}

interface SequenceData {
    id: string
    schedule: ScheduleData
    name: string
    lastRun?: Date | string
    orders: {
        channel: Pin['channel']
        duration: string
        offset: string
    }[]
}


// TODO: Add pagination 
// TODO: Add auth
class CRUD<T> {

    url: string

    constructor(url: string) {
        this.url = url
    }

    get = (id: string, cb: Callback<T>) =>
        axios.get(this.url, {
            params: { id },
            headers: {
                "Content Type": "application/json"
            }
        })
            .then(v => cb(null, v.data))
            .catch(err => cb(err))

    post = (obj: T, cb: Callback<T>) =>
        axios.post(this.url, obj, {
            headers: {
                "Content Type": "application/json"
            }
        })
            .then(v => cb(null, v.data))
            .catch(err => cb(err))

    patch = (obj: T, cb: Callback<T>) => {
        axios.patch(this.url, obj, {
            headers: {
                "Content Type": "application/json"
            }
        })
            .then(v => cb(null, v.data))
            .catch(err => cb(err))
    }

    delete = (id: string, cb: Callback<void>) => {
        axios.delete(this.url, {
            params: { id },
            headers: {
                "Content Type": "application/json"
            }
        })
            .then(() => cb(null))
            .catch(err => cb(err))
    }

    list = (cb: Callback<T[]>) => {
        axios.get(this.url + 's', {
        })
            .then(l => cb(null, l.data))
            .catch(err => cb(err))
    }
}

export { CRUD }
export type { ScheduleData, SequenceData, Pin }
/**
 * Model Pin
 * 
 */
export type Pin = {
    channel: number
    label: string
    onState: string
}


/**
 * Model CronSequence
 * 
 */
export type CronSequence = {
    id: number
    cronId: number
    sequenceId: number
}

/**
 * Model Cron
 * 
 */
export type Cron = {
    id: number
    cron: string
    label: string
    CronSequence: {
        sequence: {
            id: number,
            name: string,
            active: boolean
        }
    }[]
}

/**
 * Model Sequence
 * 
 */
type Order = {
    channel: number
    duration: number
    offset: number
    Pin: { label: string }
}
export type Sequence = {
    id: number
    name: string
    lastRun: Date | null
    active: boolean
    orders: Order[]
    CronSequence: { cron: Cron }[]
}


/**
 * Model SequenceEvent
 * 
 */
export type SequenceEvent = {
    id: number
    date: Date
    sequenceId: number
    eventType: string
    sequence: { name: string }
}


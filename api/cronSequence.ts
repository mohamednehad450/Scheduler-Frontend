import axios from "axios"
import { CronDbType, SequenceDBType } from "../Scheduler/src/db"

type Callback<T> = (err: unknown, val?: T) => void

const url = '/api/link'

class cronSequence {

    linkCronPromise = async (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][]): Promise<CronDbType> => {
        return (await axios.post<CronDbType>(url + "/cron/" + id, sequencesIds)).data
    }
    linkCron = (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][], cb: Callback<CronDbType>) => {
        this.linkCronPromise(id, sequencesIds)
            .then(cron => cb(null, cron))
            .catch(err => cb(err))
    }

    linkSequencePromise = async (id: SequenceDBType['id'], cronsIds: CronDbType['id'][]): Promise<SequenceDBType> => {
        return (await axios.post<SequenceDBType>(url + "/sequence/" + id, cronsIds)).data

    }
    linkSequence = (id: SequenceDBType['id'], cronsIds: CronDbType['id'][], cb: Callback<SequenceDBType>) => {
        this.linkSequencePromise(id, cronsIds)
            .then(sequence => cb(sequence))
            .catch(err => cb(err))
    }
}


export default new cronSequence


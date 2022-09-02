import axios from "axios"
import { CronDbType, SequenceDBType } from "../Scheduler/src/db"

type Callback<T> = (err: unknown, val?: T) => void

const url = '/api/link'

class cronSequence {

    linkCronPromise = async (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][]): Promise<void> => {
        return axios.post(url + "/cron/" + id, sequencesIds)
    }
    linkCron = (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][], cb: Callback<void>) => {
        this.linkCronPromise(id, sequencesIds)
            .then(() => cb(null))
            .catch(err => cb(err))
    }

    linkSequencePromise = async (id: SequenceDBType['id'], cronsIds: CronDbType['id'][]): Promise<void> => {
        return axios.post(url + "/sequence/" + id, cronsIds)
    }
    linkSequence = (id: SequenceDBType['id'], cronsIds: CronDbType['id'][], cb: Callback<void>) => {
        this.linkSequencePromise(id, cronsIds)
            .then(() => cb(null))
            .catch(err => cb(err))
    }
}


export default new cronSequence


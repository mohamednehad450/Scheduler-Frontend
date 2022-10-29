import axios from "axios"
import { CronDbType, SequenceDBType } from "../Scheduler/src/db"

const url = '/api/link'




class CronSequence {

    linkCron = (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][], token: string) =>
        axios.post<CronDbType>(url + "/cron/" + id, sequencesIds, { params: { token } })

    linkSequence = (id: SequenceDBType['id'], cronsIds: CronDbType['id'][], token: string) =>
        axios.post<SequenceDBType>(url + "/sequence/" + id, cronsIds, { params: { token } })

}


export default new CronSequence


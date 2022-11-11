import axios from "axios"
import { Cron, Sequence } from "../components/common"

const url = '/api/link'




class CronSequence {

    linkCron = (id: Cron['id'], sequencesIds: Sequence['id'][], token: string) =>
        axios.post<Cron>(url + "/cron/" + id, sequencesIds, { params: { token } })

    linkSequence = (id: Sequence['id'], cronsIds: Cron['id'][], token: string) =>
        axios.post<Sequence>(url + "/sequence/" + id, cronsIds, { params: { token } })

}


export default new CronSequence


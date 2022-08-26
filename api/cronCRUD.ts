import { CRUD, } from "./utils";
import type { CronDbType, } from '../Scheduler/src/db'

const url = '/api/cron'

export default new CRUD<CronDbType['id'], CronDbType>(url)
import { CRUD, } from "./utils";
import type { ScheduleDbType, } from '../Scheduler/src/db'

const url = '/api/schedule'

export default new CRUD<ScheduleDbType['id'], ScheduleDbType>(url)
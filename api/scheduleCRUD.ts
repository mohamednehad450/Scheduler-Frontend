import { CRUD, } from "./utils";
import type { ScheduleDbType, } from '../Scheduler/src/db'

const url = 'http://localhost:8000/schedule'

export default new CRUD<ScheduleDbType['id'], ScheduleDbType>(url)
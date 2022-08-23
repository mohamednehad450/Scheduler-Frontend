import { CRUD } from "./utils";
import type { PinDbType, } from '../Scheduler/src/db'

const url = `/api/pin`

export default new CRUD<PinDbType['channel'], PinDbType>(url)
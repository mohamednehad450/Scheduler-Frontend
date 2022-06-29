import { CRUD } from "./utils";
import { PinDbType, } from '../Scheduler/src/db'

const url = 'http://localhost:8000/pin'

export default new CRUD<PinDbType['channel'], PinDbType>(url)
import { CRUD, } from "./utils";
import type { Cron, } from '../components/common'

const url = '/api/cron'

export default new CRUD<Cron['id'], Cron>(url)
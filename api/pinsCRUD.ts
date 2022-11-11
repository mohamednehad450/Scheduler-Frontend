import { CRUD } from "./utils";
import type { Pin, } from '../components/common'

const url = `/api/pin`

export default new CRUD<Pin['channel'], Pin>(url)
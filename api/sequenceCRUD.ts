import { CRUD, } from "./utils";
import type { Sequence } from '../components/common'

const url = '/api/sequence'

export default new CRUD<Sequence['id'], Sequence>(url)
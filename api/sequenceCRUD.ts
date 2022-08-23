import { CRUD, } from "./utils";
import type { SequenceDBType, } from '../Scheduler/src/db'

const url = '/api/sequence'

export default new CRUD<SequenceDBType['id'], SequenceDBType>(url)
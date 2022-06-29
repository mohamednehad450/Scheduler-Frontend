import { CRUD, } from "./utils";
import { SequenceDBType, } from '../Scheduler/src/db'
const url = 'http://localhost:8000/sequence'

export default new CRUD<SequenceDBType['id'], SequenceDBType>(url)
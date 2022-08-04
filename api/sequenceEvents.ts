import { Events, } from "./utils";
import type { SequenceEventDBType, } from '../Scheduler/src/db'

const url = 'http://localhost:8000/sequence/event'

export default new Events<SequenceEventDBType['id'], SequenceEventDBType>(url) 
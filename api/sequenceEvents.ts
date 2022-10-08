import { Events, } from "./utils";
import type { SequenceEventDBType, } from '../Scheduler/src/db'

const url = '/api/events/sequences'

export default new Events<SequenceEventDBType['id'], SequenceEventDBType>(url) 
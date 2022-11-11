import { Events, } from "./utils";
import type { SequenceEvent } from '../components/common'

const url = '/api/events/sequences'

export default new Events<SequenceEvent['id'], SequenceEvent>(url) 
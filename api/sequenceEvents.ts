import { Events, } from "./utils";
import type { SequenceEvent } from '../components/common'

const url = '/api/event/sequence'

export default new Events<SequenceEvent['id'], SequenceEvent>(url) 
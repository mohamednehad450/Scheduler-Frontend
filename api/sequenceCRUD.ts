import { CRUD, SequenceData } from "./utils";

const url = 'http://localhost:8000/sequence'

export default new CRUD<SequenceData>(url)
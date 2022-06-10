import { CRUD, Pin } from "./utils";

const url = 'http://localhost:8000/pin'

export default new CRUD<Pin>(url)
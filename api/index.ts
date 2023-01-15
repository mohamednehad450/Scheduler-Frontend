import { Cron, Pin, Sequence, SequenceEvent } from "../components/common";
import CronSequence from "./cronSequence";
import { Auth, CRUD, Events, Page, Pagination } from "./utils";

const BACKEND_BASE_URL = `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}`

const routes = {
    SEQUENCE: BACKEND_BASE_URL + '/sequence',
    PIN: BACKEND_BASE_URL + '/pin',
    CRON: BACKEND_BASE_URL + '/cron',
    EVENTS: {
        SEQUENCE: BACKEND_BASE_URL + "/event/sequence"
    },
    LINK: BACKEND_BASE_URL + '/link',
    AUTH: BACKEND_BASE_URL + '/auth',
    ACTION: BACKEND_BASE_URL + '/action',
}

const pinsCRUD = new CRUD<Pin['channel'], Pin>(routes.PIN)
const sequenceCRUD = new CRUD<Sequence['id'], Sequence>(routes.SEQUENCE)
const cronCRUD = new CRUD<Cron['id'], Cron>(routes.CRON)
const sequenceEvents = new Events<SequenceEvent['id'], SequenceEvent>(routes.EVENTS.SEQUENCE)
const cronSequence = new CronSequence(routes.LINK)
const auth = new Auth(routes.AUTH)

export {
    pinsCRUD,
    sequenceCRUD,
    sequenceEvents,
    cronCRUD,
    cronSequence,
    auth,
    CRUD,
    Events,
    BACKEND_BASE_URL,
}
export type { Page, Pagination }
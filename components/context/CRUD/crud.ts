import { createContext, useContext } from "react"
import { useCRUDWithAuth, useEventsWithAuth, useCronSequenceWithAuth } from "../auth"
import {
    cronCRUD as cronCRUDNoAuth,
    cronSequence as cronSequenceNoAuth,
    pinsCRUD as pinsCRUDNoAuth,
    sequenceCRUD as sequenceCRUDNoAuth,
    sequenceEvents as sequenceEventsNoAuth,
    Page,
    Pagination,
} from "../../../api";
import { Cron, Sequence, SequenceEvent, Pin } from "../../common";


interface CRUD<K, T> {
    get: (id: K) => Promise<{ data: T }>
    add: (obj: any) => Promise<{ data: T }>
    set: (id: K, obj: any) => Promise<{ data: T }>
    update: (id: K, obj: any) => Promise<{ data: T }>
    remove: (id: K) => Promise<{}>
    list: () => Promise<{ data: T[] }>
}

interface Events<K, T> {
    deleteAll: () => Promise<void>;
    deleteById: (id: K) => Promise<void>;
    listById: (id: K, page?: Page) => Promise<{ data: { events: T[], page: Pagination } }>
    listAll: (page?: Page) => Promise<{ data: { events: T[], page: Pagination } }>
}

interface CronSequenceCRUD {
    linkCron: (id: Cron['id'], sequencesIds: Sequence['id'][]) => Promise<{ data: Cron }>
    linkSequence: (id: Sequence['id'], cronsIds: Cron['id'][]) => Promise<{ data: Sequence }>
}


interface CRUDContext {
    pinsCRUD?: CRUD<Pin['channel'], Pin>
    sequenceCRUD?: CRUD<Sequence['id'], Sequence>
    cronCRUD?: CRUD<Cron['id'], Cron>
    sequenceEvents?: Events<SequenceEvent['id'], SequenceEvent>
    cronSequence?: CronSequenceCRUD
}


const crudContext = createContext<CRUDContext | undefined>(undefined)

const useCRUD = () => useContext(crudContext)


const useCRUDContext = (): CRUDContext | undefined => {

    const pinsCRUD = useCRUDWithAuth(pinsCRUDNoAuth)
    const sequenceCRUD = useCRUDWithAuth(sequenceCRUDNoAuth)
    const cronCRUD = useCRUDWithAuth(cronCRUDNoAuth)
    const sequenceEvents = useEventsWithAuth(sequenceEventsNoAuth)
    const cronSequence = useCronSequenceWithAuth(cronSequenceNoAuth)

    return {
        pinsCRUD,
        sequenceCRUD,
        cronCRUD,
        sequenceEvents,
        cronSequence,
    }

}



export { crudContext, useCRUDContext, useCRUD }

import { createContext, useContext } from "react"
import { useCRUDWithAuth, useEventsWithAuth, useCronSequenceWithAuth } from "../auth"
import {
    cronCRUD as cronCRUDNoAuth,
    cronSequence as cronSequenceNoAuth,
    pinsCRUD as pinsCRUDNoAuth,
    sequenceCRUD as sequenceCRUDNoAuth,
    sequenceEvents as sequenceEventsNoAuth,
} from "../../../api";
import { CronDbType, PinDbType, SequenceDBType, SequenceEventDBType, } from "../../../Scheduler/src/db";


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
    listById: (id: K) => Promise<{ data: T[] }>
    listAll: () => Promise<{ data: T[] }>
}

interface CronSequence {
    linkCron: (id: CronDbType['id'], sequencesIds: SequenceDBType['id'][]) => Promise<{ data: CronDbType }>
    linkSequence: (id: SequenceDBType['id'], cronsIds: CronDbType['id'][]) => Promise<{ data: SequenceDBType }>
}


interface CRUDContext {
    pinsCRUD?: CRUD<PinDbType['channel'], PinDbType>
    sequenceCRUD?: CRUD<SequenceDBType['id'], SequenceDBType>
    cronCRUD?: CRUD<CronDbType['id'], CronDbType>
    sequenceEvents?: Events<SequenceEventDBType['id'], SequenceEventDBType>
    cronSequence?: CronSequence
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

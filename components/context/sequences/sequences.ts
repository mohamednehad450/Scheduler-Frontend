import { createContext, useContext, useState } from "react";
import { sequenceCRUD, SequenceData } from "../../../api";


type Callback<T> = (err: unknown, val?: T) => void

interface SequencesContext {
    sequences: SequenceData[]
    refresh: () => void
    add: (s: SequenceData, cb: Callback<SequenceData>) => void
    remove: (id: SequenceData['id'], cb: Callback<void>) => void
    get: (id: SequenceData['id'], cb: Callback<SequenceData>) => void
    update: (s: SequenceData, cb: Callback<SequenceData>) => void
}


export const sequencesContext = createContext<SequencesContext | undefined>(undefined)

export const initSequencesContext = (): SequencesContext => {


    const [sequences, setSequences] = useState<SequenceData[]>([])


    const refresh = () => sequenceCRUD.list((err, ls) => {
        if (err) {
            // TODO
            return
        }
        ls && setSequences(ls)
    })


    const add = (s: SequenceData, cb: Callback<SequenceData>) => sequenceCRUD.post(s, (err, val) => {
        if (err) {
            cb(err)
            return
        }
        val && setSequences(arr => [...arr, val])
        cb(null, s)
    })


    const remove = (id: SequenceData['id'], cb: Callback<void>) => sequenceCRUD.delete(id, (err) => {
        if (err) {
            cb(err)
            return
        }
        setSequences(arr => arr.filter(s => s.id !== id))
        cb(null)
    })


    const get = (id: SequenceData['id'], cb: Callback<SequenceData>) => {
        const s = sequences.find(s => s.id === id)
        if (s) {
            cb(null, s)
            return
        }
        sequenceCRUD.get(id, (err, s) => {
            if (err) {
                cb(err)
                return
            }
            cb(null, s)
            refresh()
        })
    }


    const update = (s: SequenceData, cb: Callback<SequenceData>) => sequenceCRUD.patch(s, (err, s) => {
        if (err) {
            cb(err)
            return
        }
        s && setSequences(arr => arr.map(oldS => s.id === oldS.id ? s : oldS))
        cb(null, s)
    })



    return {
        sequences,
        refresh,
        remove,
        get,
        update,
        add
    }
}

export const useSequence = () => useContext(sequencesContext)
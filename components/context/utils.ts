import { useEffect, useState } from "react"
import { CRUD } from "../../api/utils"


type Callback<T> = (err: unknown, val?: T) => void

interface CRUDContext<K, T> {
    list: T[]
    refresh: () => void
    add: (s: T, cb: Callback<T>) => void
    remove: (id: K, cb: Callback<void>) => void
    get: (id: K, cb: Callback<T>) => void
    set: (id: K, s: T, cb: Callback<T>) => void
    update: (id: K, s: Partial<T>, cb: Callback<T>) => void
}

function initCRUDContext<K, T>(CRUD: CRUD<K, T>, keyExtractor: (obj: T) => K): CRUDContext<K, T> {

    const [list, setList] = useState<T[]>([])


    const refresh = () => CRUD.list((err, ls) => {
        if (err) {
            // TODO
            return
        }
        ls && setList(ls)
    })

    useEffect(() => { refresh() }, [])

    const add = (s: T, cb: Callback<T>) => CRUD.post(s, (err, val) => {
        if (err) {
            cb(err)
            return
        }
        val && setList(arr => [...arr, val])
        cb(null, s)
    })


    const remove = (id: K, cb: Callback<void>) => CRUD.delete(id, (err) => {
        if (err) {
            cb(err)
            return
        }
        setList(arr => arr.filter(s => keyExtractor(s) !== id))
        cb(null)
    })


    const get = (id: K, cb: Callback<T>) => {
        const s = list.find(s => keyExtractor(s) === id)
        if (s) {
            cb(null, s)
            return
        }
        CRUD.get(id, (err, s) => {
            if (err) {
                cb(err)
                return
            }
            cb(null, s)
            refresh()
        })
    }


    const update = (id: K, s: Partial<T>, cb: Callback<T>) => CRUD.patch(id, s, (err, s) => {
        if (err) {
            cb(err)
            return
        }
        s && setList(arr => arr.map(oldS => keyExtractor(s) === keyExtractor(oldS) ? s : oldS))
        cb(null, s)
    })

    const set = (id: K, s: T, cb: Callback<T>) => CRUD.put(id, s, (err, s) => {
        if (err) {
            cb(err)
            return
        }
        s && setList(arr => arr.map(oldS => keyExtractor(s) === keyExtractor(oldS) ? s : oldS))
        cb(null, s)
    })


    return {
        list,
        refresh,
        remove,
        get,
        update,
        add,
        set,
    }
}

export { initCRUDContext }
export type { CRUDContext }
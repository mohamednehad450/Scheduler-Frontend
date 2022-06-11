import { useState } from "react"
import { CRUD } from "../../api/utils"


type Callback<T> = (err: unknown, val?: T) => void

interface CRUDContext<T extends { id: unknown }> {
    list: T[]
    refresh: () => void
    add: (s: T, cb: Callback<T>) => void
    remove: (id: T['id'], cb: Callback<void>) => void
    get: (id: T['id'], cb: Callback<T>) => void
    update: (s: T, cb: Callback<T>) => void
}

function initCRUDContext<T extends { id: unknown }>(CRUD: CRUD<T>): CRUDContext<T> {

    const [list, setList] = useState<T[]>([])


    const refresh = () => CRUD.list((err, ls) => {
        if (err) {
            // TODO
            return
        }
        ls && setList(ls)
    })


    const add = (s: T, cb: Callback<T>) => CRUD.post(s, (err, val) => {
        if (err) {
            cb(err)
            return
        }
        val && setList(arr => [...arr, val])
        cb(null, s)
    })


    const remove = (id: T['id'], cb: Callback<void>) => CRUD.delete(id, (err) => {
        if (err) {
            cb(err)
            return
        }
        setList(arr => arr.filter(s => s.id !== id))
        cb(null)
    })


    const get = (id: T['id'], cb: Callback<T>) => {
        const s = list.find(s => s.id === id)
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


    const update = (s: T, cb: Callback<T>) => CRUD.patch(s, (err, s) => {
        if (err) {
            cb(err)
            return
        }
        s && setList(arr => arr.map(oldS => s.id === oldS.id ? s : oldS))
        cb(null, s)
    })



    return {
        list,
        refresh,
        remove,
        get,
        update,
        add
    }

}

export { initCRUDContext }
export type { CRUDContext }
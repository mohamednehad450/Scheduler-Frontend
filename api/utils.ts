import axios from "axios"

type Callback<T> = (err: unknown, val?: T) => void

interface CRUDClass<K, T> {
    get: (id: K) => Promise<{ data: T }>
    add: (obj: any) => Promise<{ data: T }>
    set: (id: K, obj: any) => Promise<{ data: T }>
    update: (id: K, obj: any) => Promise<{ data: T }>
    remove: (id: K) => Promise<{}>
    list: () => Promise<{ data: T[] }>
}
// TODO: Add pagination 
// TODO: Add auth
class CRUD<K, T> implements CRUDClass<K, T>{

    url: string

    constructor(url: string) {
        this.url = url
    }
    get = (id: K) => axios.get<T>(this.url + '/' + id);
    add = (obj: any) => axios.post<T>(this.url, obj);
    set = (id: K, obj: any) => axios.put<T>(this.url + "/" + id, obj);
    update = async (id: K, obj: any) => axios.patch<T>(this.url + "/" + id, obj)
    remove = (id: K) => axios.delete<void>(this.url + "/" + id);
    list = () => axios.get<T[]>(this.url + 's',);
}


class Events<K, T>  {
    url: string

    constructor(url: string) {
        this.url = url
    }

    getPromise = (id: K) => axios.get(this.url + '/' + id);


    get = (id: K, cb: Callback<T>) => this.getPromise(id)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    deletePromise = (id: K) => axios.delete(this.url + "/" + id);
    delete = (id: K, cb: Callback<void>) => this.deletePromise(id)
        .then(() => cb(null))
        .catch(err => cb(err));

    deleteAllPromise = () => axios.delete<void>(this.url + "s");
    deleteAll = (cb: Callback<void>) => this.deleteAllPromise()
        .then(() => cb(null))
        .catch(err => cb(err))

    deleteByObjectPromise = (objId: any) => axios.delete(this.url + "s/" + objId);
    deleteByObject = (objId: any, cb: Callback<void>) => this.deleteByObjectPromise(objId)
        .then(() => cb(null))
        .catch(err => cb(err));


    listPromise = (id: any) => axios.get(this.url + 's/' + id,);
    list = (id: any, cb: Callback<T[]>) => this.listPromise(id)
        .then(l => cb(null, l.data))
        .catch(err => cb(err));


    listAllPromise = () => axios.get(this.url + 's',);
    listAll = (cb: Callback<T[]>) => this.listAllPromise()
        .then(l => cb(null, l.data))
        .catch(err => cb(err));


}

export { CRUD, Events }
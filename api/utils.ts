import axios from "axios"

type Callback<T> = (err: unknown, val?: T) => void

// TODO: Add pagination 
// TODO: Add auth
class CRUD<K, T> {

    url: string

    constructor(url: string) {
        this.url = url
    }

    getPromise = (id: K) => axios.get(this.url + '/' + id);


    get = (id: K, cb: Callback<T>) => this.getPromise(id)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    postPromise = (obj: T) => axios.post(this.url, obj);


    post = (obj: T, cb: Callback<T>) => this.postPromise(obj)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    putPromise = (id: K, obj: T) => axios.put(this.url + "/" + id, obj);


    put = (id: K, obj: T, cb: Callback<T>) => this.putPromise(id, obj)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    patchPromise = async (id: K, obj: Partial<T>) => axios.patch(this.url + "/" + id, obj)



    patch = (id: K, obj: Partial<T>, cb: Callback<T>) => this.patchPromise(id, obj)
        .then(obj => cb(null, obj.data))
        .catch(err => cb(err))


    deletePromise = (id: K) => axios.delete(this.url + "/" + id);


    delete = (id: K, cb: Callback<void>) => this.deletePromise(id)
        .then(() => cb(null))
        .catch(err => cb(err));


    listPromise = () => axios.get(this.url + 's',);
    list = (cb: Callback<T[]>) => this.listPromise()
        .then(l => cb(null, l.data))
        .catch(err => cb(err));


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
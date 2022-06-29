import axios from "axios"

type Callback<T> = (err: unknown, val?: T) => void

// TODO: Add pagination 
// TODO: Add auth
class CRUD<T extends { id: unknown }> {

    url: string

    constructor(url: string) {
        this.url = url
    }

    getPromise = (id: T['id']) => axios.get(this.url, {
        params: { id },
        headers: {
            "Content Type": "application/json"
        }
    });


    get = (id: T['id'], cb: Callback<T>) => this.getPromise(id)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    postPromise = (obj: T) => axios.post(this.url, obj, {
        headers: {
            "Content Type": "application/json"
        }
    });


    post = (obj: T, cb: Callback<T>) => this.postPromise(obj)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    patchPromise = (obj: T) => axios.patch(this.url, obj, {
        headers: {
            "Content Type": "application/json"
        }
    });


    patch = (obj: T, cb: Callback<T>) => this.patchPromise(obj)
        .then(v => cb(null, v.data))
        .catch(err => cb(err));


    deletePromise = (id: T['id']) => axios.delete(this.url, {
        params: { id },
        headers: {
            "Content Type": "application/json"
        }
    });


    delete = (id: T['id'], cb: Callback<void>) => this.deletePromise(id)
        .then(() => cb(null))
        .catch(err => cb(err));


    listPromise = () => axios.get(this.url + 's',);
    list = (cb: Callback<T[]>) => this.listPromise()
        .then(l => cb(null, l.data))
        .catch(err => cb(err));


}

export { CRUD }
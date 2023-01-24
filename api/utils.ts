import axios from "axios"
import { Sequence } from "../components/common"
import { DeviceState } from "../components/context"


interface CRUDClass<K, T> {
    get: (id: K, token: string) => Promise<{ data: T }>
    add: (obj: any, token: string) => Promise<{ data: T }>
    set: (id: K, obj: any, token: string) => Promise<{ data: T }>
    update: (id: K, obj: any, token: string) => Promise<{ data: T }>
    remove: (id: K, token: string) => Promise<{}>
    list: (token: string) => Promise<{ data: T[] }>
}
// TODO: Add pagination 
class CRUD<K, T> implements CRUDClass<K, T>{

    url: string

    constructor(url: string) {
        this.url = url
    }
    get = (id: K, token: string) => axios.get<T>(this.url + '/' + id, { params: { token } });
    add = (obj: any, token: string) => axios.post<T>(this.url, obj, { params: { token } });
    set = (id: K, obj: any, token: string) => axios.put<T>(this.url + "/" + id, obj, { params: { token } });
    update = async (id: K, obj: any, token: string) => axios.patch<T>(this.url + "/" + id, obj, { params: { token } })
    remove = (id: K, token: string) => axios.delete<void>(this.url + "/" + id, { params: { token } });
    list = (token: string) => axios.get<T[]>(this.url, { params: { token } });
}


interface EventsClass<K, T> {
    deleteAll: (token: string) => Promise<void>;
    deleteById: (id: K, token: string) => Promise<void>;
    listById: (id: K, token: string) => Promise<{ data: { events: T[], page: Pagination } }>
    listAll: (token: string) => Promise<{ data: { events: T[], page: Pagination } }>
}

type Page = {
    page: number,
    perPage?: number
}
type Pagination = {
    current: number,
    perPage: number,
    total: number
}
class Events<K, T> implements EventsClass<K, T>  {
    url: string

    constructor(url: string) {
        this.url = url
    }

    deleteAll = async (token: string) => axios.delete<void, void>(this.url, { params: { token } });
    deleteById = (id: K, token: string) => axios.delete<void, void>(this.url + "/" + id, { params: { token } });
    listById = (id: K, token: string, page?: Page) => axios.get<{ events: T[], page: Pagination }>(this.url + '/' + id, { params: { token, ...page }, });
    listAll = (token: string, page?: Page) => axios.get<{ events: T[], page: Pagination }>(this.url, { params: { token, ...page } });
}


class Auth {

    url: string

    constructor(url: string) {
        this.url = url
    }

    register = async (user: any) => axios.post<{ username: string, token: string }>(this.url + '/register', user)
    login = async (user: any) => axios.post<{ username: string, token: string }>(this.url + '/login', user)
    validate = async (token: string) => axios.post<void>(this.url + '/validate', { token })
}

class DeviceAction {
    url: string

    constructor(url: string) {
        this.url = url
    }

    getState = async (token: string) => axios.get<DeviceState>(this.url + '/state', { params: { token } });
    getTime = async (token: string) => axios.get<{ time: string }>(this.url + '/time', { params: { token } });
    resetDevice = async (token: string) => axios.post<DeviceState>(this.url + '/reset', null, { params: { token } });
    run = (id: number, token: string) => axios.post<{ state: DeviceState, sequence: Sequence }>(this.url + "/run/" + id, null, { params: { token } });
    stop = (id: number, token: string) => axios.post<DeviceState>(this.url + "/stop/" + id, null, { params: { token } });
}


export { CRUD, Events, Auth, DeviceAction }
export type { Page, Pagination }
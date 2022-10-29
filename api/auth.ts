import axios from "axios"


const url = "/api/auth"


class Auth {
    register = async (user: any) => axios.post<{ username: string, token: string }>(url + '/register', user)
    login = async (user: any) => axios.post<{ username: string, token: string }>(url + '/login', user)
    validate = async (token: string) => axios.post<void>(url + '/validate', { token })
}

export default new Auth()
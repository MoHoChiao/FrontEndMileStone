import axios from 'axios';

export const HTTP_AUTH = axios.create({
    baseURL: `http://` + '127.0.0.1:8080' + `/ResourceAdminService/`,
    //baseURL: '/ResourceAdminService/',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    //responseType: 'json',
    auth: {
        username: 'leoliu',
        password: 'leoliu543'
    },
})
export const HTTP_TRINITY = axios.create({
    baseURL: `http://` + '127.0.0.1:8080' + `/ResourceAdminService/`,
    //baseURL: '/ResourceAdminService/',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    //responseType: 'json',
    auth: {
        username: 'leoliu',
        password: 'leoliu543'
    },
})
export const HTTP_TRINITY_Upload = axios.create({
    baseURL: `http://` + '127.0.0.1:8080' + `/ResourceAdminService/`,
    //baseURL: '/ResourceAdminService/',
    timeout: 100000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    //responseType: 'json',
    auth: {
        username: 'leoliu',
        password: 'leoliu543'
    },
})
export const HTTP_TRINITY_Download = axios.create({
    baseURL: `http://` + '127.0.0.1:8080' + `/ResourceAdminService/`,
    //baseURL: '/ResourceAdminService/',
    timeout: 60000,
    withCredentials: true,
    responseType: 'blob',
    headers: {
        'Content-Type': 'application/json'
    },
    //responseType: 'json',
    auth: {
        username: 'leoliu',
        password: 'leoliu543'
    },
})

export function errorHandle(store, error) {
    if (error.response && error.response.data) {
        let msg = error.response.data

        if (error.response.data.message) {
            if (error.response.data.error) {
                msg = error.response.data.error + ". "
                msg += error.response.data.message
            } else {
                msg = error.response.data.message
            }

            if (error.response.data.exception)
                msg = error.response.data.exception + ' [' + msg + ']'
        }

        let status = 'Error'
        if (error.response.status && (error.response.status === 401 || msg.indexOf('Permission') > -1))
            status = 'Warn'

        let newStatus = {
            "msg": msg,
            "status": status
        }

        if (store)
            store.dispatch('setSystemStatus', newStatus)
        else
            console.log(newStatus)
    } else {
        let newStatus = {
            "msg": error.message,
            "status": "Error"
        }

        if (store)
            store.dispatch('setSystemStatus', newStatus)
        else
            console.log(newStatus)
    }
}
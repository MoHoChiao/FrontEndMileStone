import axios from 'axios';

export const HTTP_AUTH = axios.create({
    baseURL: `http://` + '127.0.0.1:8080' + `/auth-service/`,
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
    baseURL: `http://` + '127.0.0.1:8080' + `/trinity-service/`,
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
    baseURL: `http://` + '127.0.0.1:8080' + `/zuul/trinity-service/`,
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
    baseURL: `http://` + '127.0.0.1:8080' + `/zuul/trinity-service/`,
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

        let newStatus = {
            "msg": msg,
            "status": "Error"
        }
        store.dispatch('setSystemStatus', newStatus)
    } else {
        let newStatus = {
            "msg": error.message,
            "status": "Error"
        }
        store.dispatch('setSystemStatus', newStatus)
    }
}
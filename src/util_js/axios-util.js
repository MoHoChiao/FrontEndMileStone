import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `http://192.168.27.63:8080/frontend-trinity-service/`,
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
export const HTTPRepo = axios.create({
    baseURL: `http://192.168.27.63:8080/backend-trinity-repository/`,
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
export const HTTPUpload = axios.create({
    baseURL: `http://192.168.27.63:8080/zuul/backend-trinity-repository/`,
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
export const HTTPDownload = axios.create({
    baseURL: `http://192.168.27.63:8080/zuul/backend-trinity-repository/`,
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
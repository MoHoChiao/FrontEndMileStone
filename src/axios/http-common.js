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
    timeout: 30000,
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
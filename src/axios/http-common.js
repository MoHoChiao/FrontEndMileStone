import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `http://192.168.7.63:8001/`,
    timeout: 5000,
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
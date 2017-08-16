import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `http://192.168.7.63:8010/`,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    }
})
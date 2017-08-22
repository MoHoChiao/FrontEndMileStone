import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `http://localhost:8001/`,
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'json',
    auth: {
        username: 'leoliu',
        password: 'leoliu543'
    },
})
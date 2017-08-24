import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `http://localhost:8001/`,
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
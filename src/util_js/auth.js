import { HTTP_AUTH } from './axios_util';
// utils to delay promise
export const NON_SPEED = 0;
export const SLOW_SPEED = 1000; //maby for short term ajax, one db record save, edit, delete, ...
export const FAST_SPEED = 500; //maby for long term ajax, load db records, io operation, batch db records access, ...
export function Authentication(next) {
    HTTP_AUTH.get(`authentication/find-authn`)
        .then(response => {
            if (response.data.status === 'Success') {
                next()
            } else {
                next({ path: '/' })
            }
        })
        .catch(error => {
            next({ path: '/' })
        })
}
import { HTTP } from './axios_util';
// utils to delay promise
export const NON_SPEED = 0;
export const SLOW_SPEED = 1000; //maby for short term ajax, one db record save, edit, delete, ...
export const FAST_SPEED = 500; //maby for long term ajax, load db records, io operation, batch db records access, ...
export function Authentication(next) {
    HTTP.get(`authc-lib/find-authc`)
        .then(response => {
            if (response.data.status === 'Success') {
                //console.log('aaaaa1111')
                next()
            } else {
                //console.log('bbbbb1111')
                next({ path: '/' })
            }
        })
        .catch(error => {
            next({ path: '/' })
        })
}
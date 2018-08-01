import { HTTP_AUTH, errorHandle } from './axios_util';
// utils to delay promise
export const NON_SPEED = 0;
export const SLOW_SPEED = 1000; //maby for short term ajax, one db record save, edit, delete, ...
export const FAST_SPEED = 500; //maby for long term ajax, load db records, io operation, batch db records access, ...
export function Authentication(next) {
    HTTP_AUTH.get(`authentication/find-authn`)
        .then(response => {
            if (response.data.status === 'Success') {
                HTTP_AUTH.get(`authorization/loadPermissionTable`)
                    .then(response => {
                        console.log(response.data)
                    })
                    .catch(error => {
                        errorHandle(undefined, error)
                    })
                next()
            } else {
                next({ path: '/' })
            }
        })
        .catch(error => {
            next({ path: '/' })
        })
}
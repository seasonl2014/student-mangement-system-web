import request from '../request'
export function getIndexTotalApi() {
    return request({
        url: 'home',
        method: 'get'
    })
}

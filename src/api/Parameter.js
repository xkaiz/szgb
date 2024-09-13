import request from '@/utils/Request'

export default {
    getLatestParameters() {
        return request({
            url: '/Parameter/getLatest',
            method: 'get'
        })
    },
    addParameters(parameters) {
        return request({
            url: '/Parameter/add',
            method: 'post',
            data: parameters
        })
    },
}
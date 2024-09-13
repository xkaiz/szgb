import request from '@/utils/Request'

export default {
    getLogin(data) {
        return request({
            url: '/sys/user/login',
            method: 'post',
            data: data
        })
    },
}
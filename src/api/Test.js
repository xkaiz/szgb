import request from '@/utils/Request'

export default {
    test() {
        return request({
            url: '/sys/department/list',
            method: 'get',
        })
    },
}
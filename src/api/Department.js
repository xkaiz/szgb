import request from '@/utils/Request'

export default {
    getDepartmentList() {
        return request({
            url: '/sys/department/list',
            method: 'get',
        })
    },
}
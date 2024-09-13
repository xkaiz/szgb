import request from '@/utils/Request'
import { List } from 'echarts'

export default {
    getLogin(data) {
        return request({
            url: '/sys/user/login',
            method: 'post',
            data: data
        })
    },

    getUserList(data){
        return request({
            url: '/sys/user/list',
            method: 'get',
            data: data
        })
    }
}
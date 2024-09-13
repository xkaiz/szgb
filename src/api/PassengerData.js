import request from '@/utils/Request'

export default {
    //新增记录
    addPassengerData(jsonData) {
        return request({
            url: '/PassengerData/add',
            method: 'post',
            data: jsonData
        })
    },

    //获得所有记录
    getAllPassengerData() {
        return request({
            url: '/PassengerData/getAll',
            method: 'post'
        })
    },

    //根据id删除记录
    deletePassengerData(id) {
        return request({
            url: '/PassengerData/delete',
            method: 'post',
            params: { id }
        })
    },

    //根据行别、方向和日期查询记录
    getPassengerDataBy(line, direction, date) {
        return request({
            url: '/PassengerData/getBy',
            method: 'post',
            params: { line, direction, date }
        })
    }
}
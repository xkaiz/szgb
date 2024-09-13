import request from '@/utils/Request'

export default {
/**
 * 获取部门列表
 * @return 返回一个Promise对象，该Promise对象在请求完成后解决为包含部门列表的响应
 */
getDepartmentList() {
    return request({
        url: '/sys/department/list',
        method: 'get',
    })
}
}
import request from "@/utils/Request";

export default {
    //获取部门列表
    getDepartmentList(data) {
        return request({
            url: "/sys/department/list",
            method: "post",
            data: data,
        });
    },
};

import request from "@/utils/Request";

export default {
    //登录
    getLogin(data) {
        return request({
            url: "/sys/user/login",
            method: "post",
            data: data,
        });
    },

    //获得用户列表
    getUserList(data) {
        return request({
            url: "/sys/user/list",
            method: "post",
            data: data,
        });
    },
};

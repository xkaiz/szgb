import request from "@/utils/Request";

export default {
	//登录
	login(data) {
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

	//更新用户信息
	save(data) {
		return request({
			url: "/sys/user/save",
			method: "post",
			data: data,
		});
	},

	//删除用户
	delete(ids) {
		return request({
			url: "/sys/user/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

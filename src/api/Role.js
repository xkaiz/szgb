import request from "@/utils/Request";

export default {
	//获取角色列表
	getRoleList(data) {
		return request({
			url: "/sys/role/list",
			method: "post",
			data: data,
		});
	},
	//获取用户角色
	getUserRole(data) {
		return request({
			url: "/sys/userRole/list",
			method: "post",
			data: data,
		});
	},
};

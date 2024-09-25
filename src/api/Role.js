import request from "@/utils/Request";

export default {
	//获取用户角色
	getUserRole(data) {
		return request({
			url: "/sys/userRole/list",
			method: "post",
			data: data,
		});
	},

	//获得角色id对应的中文名称
	getRoleName(data) {
		return request({
			url: "/sys/role/list",
			method: "post",
			data: data,
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取用户角色列表
	getUserRoleList(data) {
		return request({
			url: "/sys/userRole/list",
			method: "post",
			data: data,
		});
	},
	//更新证书
	save(data) {
		return request({
			url: "/userRole/save",
			method: "post",
			data: data,
		});
	},

	//删除证书
	delete(ids) {
		return request({
			url: "/userRole/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取用户角色列表
	list(data) {
		return request({
			url: "/sys/user/role/list",
			method: "post",
			data: data,
		});
	},
	//更新证书
	save(data) {
		return request({
			url: "/sys/user/role/save",
			method: "post",
			data: data,
		});
	},

	//删除证书
	delete(ids) {
		return request({
			url: "/sys/user/role/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

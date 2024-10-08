import request from "@/utils/Request";

export default {
	//获取角色列表
	list(data) {
		return request({
			url: "/sys/role/list",
			method: "post",
			data: data,
		});
	},

	//更新角色
	save(data) {
		return request({
			url: "/sys/role/save",
			method: "post",
			data: data,
		});
	},

	//删除角色
	delete(ids) {
		return request({
			url: "/sys/role/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取部门列表
	list(data) {
		return request({
			url: "/sys/department/list",
			method: "post",
			data: data,
		});
	},

	//更新部门信息
	save(data) {
		return request({
			url: "/sys/department/save",
			method: "post",
			data: data,
		});
	},

	//删除部门
	delete(ids) {
		return request({
			url: "/sys/department/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

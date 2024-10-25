import request from "@/utils/Request";

export default {
	//获取计划列表
	list(data) {
		return request({
			url: "/schedule/plan/list",
			method: "post",
			data: data,
		});
	},

	//更新计划
	save(data) {
		return request({
			url: "/schedule/plan/save",
			method: "post",
			data: data,
		});
	},

	//删除计划
	delete(ids) {
		return request({
			url: "/schedule/plan/delete",
			method: "delete",
			params: { ids: ids },
		});
	},

	test(data) {
		return request({
			url: "/schedule/plan/get",
			method: "post",
			data: data,
		});
	},
};

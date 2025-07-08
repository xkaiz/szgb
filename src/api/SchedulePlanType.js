import request from "@/utils/Request";

export default {
	//获取班次类型列表
	list(data) {
		return request({
			url: "/schedule/plan/type/list",
			method: "post",
			data: data,
		});
	},

	//更新班次类型
	save(data) {
		return request({
			url: "/schedule/plan/type/save",
			method: "post",
			data: data,
		});
	},

	//删除班次类型
	delete(ids) {
		return request({
			url: "/schedule/plan/type/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

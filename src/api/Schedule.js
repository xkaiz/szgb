import request from "@/utils/Request";

export default {
	//获取班次列表
	list(data) {
		return request({
			url: "/schedule/list",
			method: "post",
			data: data,
		});
	},

	//更新班次
	save(data) {
		return request({
			url: "/schedule/save",
			method: "post",
			data: data,
		});
	},

	//删除班次
	delete(ids) {
		return request({
			url: "/schedule/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取证书列表
	list(data) {
		return request({
			url: "/certification/list",
			method: "post",
			data: data,
		});
	},

	//根据id获取证书
	getById(data) {
		return request({
			url: "/certification/get",
			method: "post",
			data: data,
		});
	},

	//更新证书
	save(data) {
		return request({
			url: "/certification/save",
			method: "post",
			data: data,
		});
	},

	//删除证书
	delete(ids) {
		return request({
			url: "/certification/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

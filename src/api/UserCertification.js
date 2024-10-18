import request from "@/utils/Request";

export default {
	//获得用户证书列表
	list(data) {
		return request({
			url: "/sys/user/certification/list",
			method: "post",
			data: data,
		});
	},

	//更新证书
	save(data) {
		return request({
			url: "/sys/user/certification/save",
			method: "post",
			data: data,
		});
	},

	//删除证书
	delete(ids) {
		return request({
			url: "/sys/user/certification/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

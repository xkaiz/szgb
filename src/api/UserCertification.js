import request from "@/utils/Request";

export default {
	//获得用户证书列表
	getUserCertificationList(data) {
		return request({
			url: "/userCertification/list",
			method: "post",
			data: data,
		});
	},

	//更新证书
	save(data) {
		return request({
			url: "/userCertification/save",
			method: "post",
			data: data,
		});
	},

	//删除证书
	delete(ids) {
		return request({
			url: "/userCertification/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

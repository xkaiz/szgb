import request from "@/utils/Request";

export default {
	//获取证书列表
	getCertificationList(data) {
		return request({
			url: "/certification/list",
			method: "post",
			data,
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取线路数据
	list(data) {
		return request({
			url: "/sys/line/children/list",
			method: "post",
			data: data,
		});
	},
	//更新线路数据
	save(data) {
		return request({
			url: "/sys/line/children/save",
			method: "post",
			data: data,
		});
	},

	//删除线路数据
	delete(ids) {
		return request({
			url: "/sys/line/children/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取字典数据
	list(data) {
		return request({
			url: "/sys/dict/children/list",
			method: "post",
			data: data,
		});
	},
	//更新字典数据
	save(data) {
		return request({
			url: "/sys/dict/children/save",
			method: "post",
			data: data,
		});
	},

	//删除字典数据
	delete(ids) {
		return request({
			url: "/sys/dict/children/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

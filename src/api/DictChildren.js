import request from "@/utils/Request";

export default {
	//获取字典数据列表
	list(data) {
		return request({
			url: "/sys/dict/Children/list",
			method: "post",
			data: data,
		});
	},

	//更新字典数据
	save(data) {
		return request({
			url: "/sys/dict/Children/save",
			method: "post",
			data: data,
		});
	},

	//删除字典数据
	delete(ids) {
		return request({
			url: "/sys/dict/Children/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

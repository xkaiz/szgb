import request from "@/utils/Request";

export default {
	//获取字典列表
	list(data) {
		return request({
			url: "/sys/dict/treeList",
			method: "post",
			data: data,
		});
	},

	//更新字典
	save(data) {
		return request({
			url: "/sys/dict/save",
			method: "post",
			data: data,
		});
	},

	//删除字典
	delete(ids) {
		return request({
			url: "/sys/dict/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

import request from "@/utils/Request";

export default {
	//获取线路列表
	list() {
		return request({
			url: "/sys/line/treeList",
			method: "post",
		});
	},

	//更新线路
	save(data) {
		return request({
			url: "/sys/line/save",
			method: "post",
			data: data,
		});
	},

	//删除线路
	delete(ids) {
		return request({
			url: "/sys/line/delete",
			method: "delete",
			params: { ids: ids },
		});
	},
};

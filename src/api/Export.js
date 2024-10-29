import request from "@/utils/Request";

export default {
	//导出班次
	exportSchedule() {
		return request({
			url: "/schedule/export",
			method: "get",
		});
	},
};

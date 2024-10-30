import request from "@/utils/Request";

export default {
	//导出班次
	exportSchedule(data) {
		return request({
			url: "/schedule/export",
			method: "post",
			responseType: "blob",
			data,
		})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", "fileName.xlsx");
				document.body.appendChild(link);
				link.click();
				link.remove();
			})
			.catch((error) => {
				console.error("Export failed: ", error);
			});
	},
};

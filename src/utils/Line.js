import { ref } from "vue";
import lineAPI from "@/api/line";
import { buildTree } from "@/utils/BuildTree";
import useStore from "@/store/index";
import { ElMessage } from "element-plus";
const store = useStore();

export const getLines = () => {
	return lineAPI
		.list()
		.then((res) => {
			store.setLine(buildTree(res.data.lineTree));
			console.log("线路加载成功");
		})
		.catch((err) => {
			console.log(err);
			ElMessage.error("线路加载失败，请检查网络连接");
			return Promise.reject(err);
		});
};

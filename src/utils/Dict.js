import { ref } from "vue";
import dictAPI from "@/api/dict";
import { buildTree } from "@/utils/BuildTree";
import useStore from "@/store/index";
import { ElMessage } from "element-plus";
const store = useStore();

const dict = ref({
	page: {
		pageNo: 1,
		pageSize: 20,
		orderBy: "",
	},
});

export const getDicts = () => {
	return dictAPI
		.list(dict.value)
		.then((res) => {
			store.setDict(buildTree(res.data.dictTree));
			console.log("字典加载成功");
		})
		.catch((err) => {
			console.log(err);
			ElMessage.error("字典加载失败，请检查网络连接");
			return Promise.reject(err);
		});
};

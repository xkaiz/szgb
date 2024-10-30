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
			store.setDictUpdateDate(new Date().getTime());
		})
		.catch((err) => {
			console.log(err);
			ElMessage.error("字典加载失败，请检查网络连接");
			return Promise.reject(err);
		});
};

export const isNeedUpdate = () => {
	const currentDate = new Date().getTime();
	const updateDate = store.dictUpdateTime;
	if (!updateDate) return true;
	return (currentDate - updateDate) / 1000 > 60 * 60 * 24 * 3;
};

import { ref } from "vue";
import schedulePlanTypeAPI from "@/api/schedulePlanType";
import useStore from "@/store/index";
import { ElMessage } from "element-plus";
const store = useStore();

const schedulePlanType = ref({
	page: {
		pageNo: 1,
		pageSize: 19940824,
		orderBy: "",
	},
});

export const getSchedulePlanType = () => {
	return schedulePlanTypeAPI
		.list(schedulePlanType.value)
		.then((res) => {
			store.setSchedulePlanType(res.data.page.list);
			console.log("班次类型加载成功");
		})
		.catch((err) => {
			console.log(err);
			ElMessage.error("班次类型加载失败，请检查网络连接");
			return Promise.reject(err);
		});
};

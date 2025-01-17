import { ref } from "vue";
import departmentAPI from "@/api/department";
import { buildTree } from "@/utils/BuildTree";
import useStore from "@/store/index";
import { ElMessage } from "element-plus";
const store = useStore();

const department = ref({
	page: {
		pageNo: 1,
		pageSize: 20,
		orderBy: "",
	},
});

export const getDepartments = () => {
	return departmentAPI
		.list(department.value)
		.then((res) => {
			store.setDepartmentList(buildTree(res.data.page.list));
			console.log("部门加载成功");
		})
		.catch((err) => {
			console.log(err);
			ElMessage.error("部门加载失败，请检查网络连接");
			return Promise.reject(err);
		});
};

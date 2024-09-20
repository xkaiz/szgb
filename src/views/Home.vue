<template>
	<h1>首页</h1>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useStore from "@/store/index";
const store = useStore();

import { buildTree } from "@/utils/BuildTree";
import userAPI from "@/api/User";
import departmentAPI from "@/api/Department";
import { ElMessage } from "element-plus";


const user = ref({
	department: {
		id: "",
	},
	page: {
		pageNo: 1,
		pageSize: 10
	}
});

const department = ref({
	name: "厦门轨道集团",
});

onMounted(() => {
	const url = new URL(window.location.href);
	const token = url.searchParams.get("token");
	if (token == null || token == "") {
		window.location.href = "/login";
	} else {
		dataInit();
	}
});

const dataInit = () => {
	Promise.all([
		userAPI.getUserList(user.value).then((res) => {
			res.data.page.list.count = res.data.page.count;
			store.setUserList(res.data.page.list);
		}),
		departmentAPI.getDepartmentList(department.value).then((res) => {
			store.setDepartmentList(buildTree(res.data.page.list));
		}),
	]).then((res) => {
		ElMessage.success("数据加载完成");
	}).catch((error) => {
		console.log(error);
		ElMessage.error("数据加载失败");
	});
}
</script>

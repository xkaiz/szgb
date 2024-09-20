<template>
	<el-container class="container">
		<el-aside class="tree">
			<el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
			<el-tree ref="treeRef" :data="treeData" highlight-current @node-click="handleNodeClick"
				:filter-node-method="filterNode" v-loading="departmentLoading" />
		</el-aside>
		<el-main class="main">
			<el-row class="search">
				<el-row class="search-item">
					<el-input v-model="user.username" placeholder="用户名" clearable />
				</el-row>
				<el-row class="search-item">
					<el-input v-model="user.name" placeholder="姓名" clearable />
				</el-row>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" @click="clear">重置</el-button>

			</el-row>
			<el-row class="toolbar">
				<div>
					<el-button type="primary">新建</el-button>
					<el-button type="danger" plain :disabled="deleteButtonDisabled" @click="del">删除</el-button>
				</div>
				<el-button-group>
					<!-- <el-button type="default">导入</el-button>
					<el-button type="default">导出</el-button> -->
					<el-button type="default" @click="refreshTable">刷新</el-button>
				</el-button-group>
			</el-row>
			<el-table class="table" :data="tableData" stripe v-loading="userLoading"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" header-align="center" align="center" width="50" />
				<el-table-column prop="id" label="id" width="80" align="center" v-if="false" />
				<el-table-column prop="username" label="用户名" show-overflow-tooltip width="180" />
				<el-table-column prop="name" label="姓名" show-overflow-tooltip width="180" />
				<el-table-column prop="department.name" label="部门" show-overflow-tooltip />
				<el-table-column fixed="right" label="操作" width="120">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
						<el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-row class="pagination">
				<el-pagination background layout="total, sizes, prev, pager, next, jumper" v-model:current-page="pageNo"
					v-model:page-size="pageSize" :total="total" :page-sizes="[10, 20, 50, 100]"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</el-row>
		</el-main>
	</el-container>
	<el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%" draggable overflow>
		<el-form :model="form">
			<el-row :gutter="15">
				<el-col :span="8">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="form.username" placeholder="请填写用户名" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="姓名" prop="name">
						<el-input v-model="form.name" placeholder="请填写姓名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="部门" prop="department">
						<el-tree-select v-model="form.department.id" :data="store.departmentList"
							:render-after-expand="false" check-strictly />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit" :loading="submitButtonLoading">
					{{ submitButtonText }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import userAPI from "@/api/User";
import departmentAPI from "@/api/Department";
import { buildTree } from "@/utils/BuildTree";
import { ElMessage, ElMessageBox } from "element-plus";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);
const userLoading = ref(true);
const departmentLoading = ref(true);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(0);

const dialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const deleteButtonDisabled = ref(true);

const ids = ref("");

const user = ref({
	username: "",
	name: "",
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

const form = ref({
	id: "",
	username: "",
	name: "",
	department: {
		id: "",
	},
	role: "",
});

onMounted(() => {
	const token = cookies.get("token");
	if (token == null || token == "") {
		window.location.href = "/login?path=RenYuan";
		return
	}
	Promise.all([
		userAPI.getUserList(user.value).then((res) => {
			res.data.page.list.count = res.data.page.count;
			store.setUserList(res.data.page.list);
			userLoading.value = false;
		}),
		departmentAPI.getDepartmentList(department.value).then((res) => {
			store.setDepartmentList(buildTree(res.data.page.list));
			departmentLoading.value = false;
		}),
	]).then(() => {
		total.value = store.userList.count;
		tableData.value = store.userList;
		treeData.value = store.departmentList;
	});

});

const search = () => {
	getUserList();
}

const clear = () => {
	const departmentID = user.value.department.id;
	user.value = {
		username: "",
		name: "",
		department: {
			id: departmentID,
		},
		page: {
			pageNo: 1,
			pageSize: 10
		}
	}
	getUserList();
}

const edit = (row) => {
	console.log(row);
	form.value.id = row.id;
	form.value.username = row.username;
	form.value.name = row.name;
	form.value.department = row.department;
	dialogVisible.value = true;
	dialogTitle.value = "编辑";

}

const del = (row) => {
	ElMessageBox.confirm("确定删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		if (row.id != undefined) {
			ids.value = row.id;
		}
		if (ids.value == "") {
			return
		}
		userAPI.delete(ids.value).then((res) => {
			ElMessage.success("删除成功");
			getUserList();
		}).catch(() => {
			ElMessage.error("删除失败");
		});
	}).catch(() => {
	});

}

const submit = () => {
	submitButtonLoading.value = true;
	submitButtonText.value = "提交中";
	userAPI.save(form.value).then((res) => {
		ElMessage.success("更新成功");
		dialogVisible.value = false;
		getUserList();
	}).catch(() => {
		ElMessage.error("更新失败");
	});
	submitButtonLoading.value = false;
	submitButtonText.value = "提交";
}

watch(filterText, (value) => {
	treeRef.value.filter(value)
})

const filterNode = (value, data) => {
	if (!value) return true
	return data.label.includes(value)
}
const handleNodeClick = (data) => {
	if (data.children.length == 0) {
		user.value.page.pageNo = 1;
		pageNo.value = 1;
		user.value.department.id = data.value;
		getUserList();
	}
};

const getUserList = () => {
	userLoading.value = true;
	userAPI.getUserList(user.value).then((res) => {
		tableData.value = [];
		res.data.page.list.forEach((element) => {
			let item = {
				id: element.id,
				username: element.username,
				name: element.name,
				department: element.department,
			};
			tableData.value.push(item);
		});
		total.value = res.data.page.count;
		userLoading.value = false;
	});
};

const refreshTable = () => {
	user.value.page.pageNo = 1;
	pageNo.value = 1;
	getUserList();
};

const handleSizeChange = (value) => {
	user.value.page.pageSize = value;
	if (pageNo.value * value > total.value) {
		pageNo.value = Math.ceil(total.value / value);
		user.value.page.pageNo = pageNo.value;
	}
	getUserList();
};

const handleCurrentChange = (value) => {
	user.value.page.pageNo = value;
	getUserList();
};

const handleSelectionChange = (value) => {
	deleteButtonDisabled.value = value.length == 0;
	ids.value = value.map((item) => item.id).join(",");
}
</script>

<style scoped>
.container {
	height: calc(100vh - 52px);
}

.search {
	margin-bottom: 1%;
}

.search-item {
	margin-right: 1%;
}

.filter {
	margin-bottom: 5%;
}

.tree {
	width: 20%;
	padding: 1%;
	border: 1px solid #ccc;
}

.main {
	height: calc(100vh - 52px);
	border: 1px solid #ccc;
}

.toolbar {
	display: flex;
	justify-content: space-between;
	margin-bottom: 1%;
}

.table {
	height: calc(100vh - 250px);
	margin-bottom: 2%;
}

.pagination {
	display: flex;
	justify-content: right;
}

.form-item {
	margin-right: 1%;
}
</style>

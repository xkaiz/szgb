<template>
	<el-container class="container">
		<el-aside class="tree">
			<el-row :gutter="5">
				<el-col :span="18">
					<el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
				</el-col>
				<el-col :span="6">
					<el-button type="primary" @click="drawerVisible = true">管理</el-button>
				</el-col>
			</el-row>
			<el-tree ref="treeRef" :data="treeData" highlight-current @node-click="handleNodeClick"
				:filter-node-method="filterNode" v-loading="departmentLoading" default-expand-all
				:expand-on-click-node="false" />
		</el-aside>
		<el-main class="main">
			<el-row class="search">
				<el-row class="search-item">
					<el-input v-model="user.username" placeholder="用户名" clearable />
				</el-row>
				<el-row class="search-item">
					<el-input v-model="user.name" placeholder="姓名" clearable />
				</el-row>
				<el-row class="search-item">
					<el-input v-model="user.no" placeholder="工号" clearable />
				</el-row>
				<el-button type="primary" @click="search">查询</el-button>
				<el-button type="primary" @click="clear">重置</el-button>
			</el-row>
			<el-row class="toolbar">
				<div>
					<el-button type="primary" @click="addUser" v-if="!roleLevelBoolean">新增</el-button>
					<el-button type="danger" plain :disabled="deleteUserButtonDisabled" @click="deleteUser"
						v-if="!roleLevelBoolean">删除</el-button>
				</div>
				<el-button-group>
					<el-button type="default" @click="refreshTable">刷新</el-button>
				</el-button-group>
			</el-row>
			<el-table class="table" :data="tableData" stripe v-loading="userLoading"
				@selection-change="handleSelectionChange" @sort-change="handleSortChange" row-key="id">
				<el-table-column type="selection" header-align="center" align="center" />
				<el-table-column prop="id" label="id" width="80" align="center" v-if="false" />
				<el-table-column prop="username" label="用户名" show-overflow-tooltip sortable="custom" />
				<el-table-column prop="name" label="姓名" show-overflow-tooltip sortable="custom" />
				<el-table-column prop="no" label="工号" show-overflow-tooltip sortable="custom" />
				<el-table-column prop="department.name" label="部门" show-overflow-tooltip sortable="custom" />
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip sortable="custom" />
				<el-table-column fixed="right" label="操作" width="120">
					<template #default="scope">
						<el-button link type="primary" size="small" @click="editUser(scope.row)">
							{{ editButtonText }}
						</el-button>
						<el-button link type="primary" size="small" @click="deleteUser(scope.row)"
							v-if="!roleLevelBoolean">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-row class="pagination">
				<el-pagination background layout="total, sizes, prev, pager, next, jumper" v-model:current-page="pageNo"
					v-model:page-size="pageSize" :total="total" :page-sizes="[20, 40, 60, 80, 100]"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</el-row>
		</el-main>
	</el-container>
	<el-dialog v-model="userDialogVisible" :title="dialogTitle" width="30%" draggable overflow>
		<el-form :model="userForm">
			<el-row :gutter="15">
				<el-col :span="12">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="userForm.username" placeholder="请填写用户名"
							:disabled="usernameDisabled || roleLevelBoolean"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="姓名" prop="name">
						<el-input v-model="userForm.name" placeholder="请填写姓名" :disabled="roleLevelBoolean"></el-input>
					</el-form-item>
				</el-col>

			</el-row>
			<el-row :gutter="15">
				<el-col :span="12">
					<el-form-item label="工号" prop="no">
						<el-input v-model="userForm.no" placeholder="请填写工号" :disabled="roleLevelBoolean"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="部门" prop="department">
						<el-tree-select v-model="userForm.department.id" :data="store.departmentList"
							:render-after-expand="false" filterable :disabled="roleLevelBoolean" />
					</el-form-item>
				</el-col>

			</el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="userDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
				<el-button type="primary" @click="submit('user')" :loading="submitButtonLoading"
					v-if="!roleLevelBoolean">
					{{ submitButtonText }}
				</el-button>
			</div>
		</template>
	</el-dialog>
	<div class="drawer">
		<el-drawer v-model="drawerVisible" direction="ltr" size="30%">
			<template #header>
				<h3>部门管理</h3>
			</template>
			<template #default>
				<el-row :gutter="5">
					<el-col :span="18">
						<el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
					</el-col>
					<el-col :span="3">
						<el-button type="primary" @click="addDepartment()" v-if="!roleLevelBoolean">新增</el-button>
					</el-col>
					<el-col :span="3">
						<el-button type="danger" plain :disabled="deleteDepartmentButtonDisabled"
							v-if="!roleLevelBoolean" @click="deleteDepartment(departmentIDs)">删除</el-button>
					</el-col>
				</el-row>
				<el-tree ref="treeRef" :data="treeData" highlight-current :filter-node-method="filterNode" show-checkbox
					@check-change="handleCheckChange" v-loading="departmentLoading" check-strictly node-key="value"
					default-expand-all>
					<template #default="{ node, data }">
						<span class="tree-node">
							<span>{{ node.label }}</span>
							<span>
								<el-button class="blue-text-button" link @click="editDepartment(data, $event);
								$event.stopPropagation()">{{ editButtonText }}</el-button>
								<el-button class="blue-text-button" link @click="deleteDepartment(node, data, $event);
								$event.stopPropagation()" v-if="!roleLevelBoolean">删除</el-button>
							</span>
						</span>
					</template>
				</el-tree>
			</template>
			<template #footer>
			</template>
		</el-drawer>
	</div>
	<el-dialog v-model="departmentDialogVisible" :title="dialogTitle" width="30%" draggable overflow>
		<el-form :model="departmentForm">
			<el-row :gutter="15">
				<el-col :span="12">
					<el-form-item label="部门名称" prop="name">
						<el-input v-model="departmentForm.name" placeholder="请填写部门名称"
							:disabled="roleLevelBoolean"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="父部门" prop="parent">
						<el-tree-select v-model="departmentForm.parent.id" :data="store.departmentList"
							:render-after-expand="false" filterable :disabled="roleLevelBoolean" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="departmentDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
				<el-button type="primary" @click="submit('department')" :loading="submitButtonLoading"
					v-if="!roleLevelBoolean">
					{{ submitButtonText }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import userAPI from "@/api/User";
import departmentAPI from "@/api/Department";
import certificationAPI from "@/api/Certification";
import { buildTree } from "@/utils/BuildTree";
import { ElMessage, ElMessageBox } from "element-plus";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);

//加载状态
const userLoading = ref(true);
const certificationLoading = ref(true);
const departmentLoading = ref(true);
const submitButtonLoading = ref(false);

//组件显示
const userDialogVisible = ref(false);
const departmentDialogVisible = ref(false);
const drawerVisible = ref(false);

//文本变量
const dialogTitle = ref("");
const submitButtonText = ref("提交");
const editButtonText = computed(() => {
	if (store.roleLevel == 1) {
		return "编辑";
	} else {
		return "查看";
	}
});

//组件可用性
const usernameDisabled = ref(true);
const deleteUserButtonDisabled = ref(true);
const deleteDepartmentButtonDisabled = ref(true);

//部门树相关
const treeChecked = ref([])

//用户和部门被多选选中的id
const userIDs = ref("");
const departmentIDs = ref("");

//分页相关
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);


//根据角色等级判断是否显示相关按钮
const roleLevelBoolean = computed(() => {
	if (store.roleLevel == 1) {
		return false;
	} else {
		return true;
	}
});

//用户查询
const user = ref({
	username: "",
	name: "",
	no: "",
	department: {
		id: "",
	},
	page: {
		pageNo: 1,
		pageSize: 20,
		orderBy: ""
	}
});

//部门查询
const department = ref({
	page: {
		pageNo: 1,
		pageSize: 20,
		orderBy: ""
	}
});

//用户表单
const userForm = ref({
	user: user.value,
	role: {}
});

//部门表单
const departmentForm = ref({
	id: "",
	name: "",
	parent: {
		id: ""
	},
	version: "",
});

onMounted(() => {
	const token = cookies.get("token");
	if (token == null || token == "") {
		window.location.href = "/login?path=RenYuan";
		return
	}
	Promise.all([
		userAPI.list(user.value).then((res) => {
			res.data.page.list.count = res.data.page.count;
			store.setUserList(res.data.page.list);
			userLoading.value = false;
		}),
		departmentAPI.list(department.value).then((res) => {
			store.setDepartmentList(buildTree(res.data.page.list));
			departmentLoading.value = false;
		}),
	]).then(() => {
		total.value = store.userList.count;
		tableData.value = store.userList;
		treeData.value = store.departmentList;
	});

});

//处理部门树节点点击
const handleNodeClick = (data) => {
	if (data.parent == "") {
		user.value.department.id = ""
		getUserList();
	} else if (data.children.length == 0) {
		user.value.page.pageNo = 1;
		pageNo.value = 1;
		user.value.department.id = data.value;
		getUserList();
	}
};
//部门树筛选
const filterNode = (value, data) => {
	if (!value) return true
	return data.label.includes(value)
}
//部门树筛选文本监听
watch(filterText, (value) => {
	treeRef.value.filter(value)
})
//处理部门树节点选中
const handleCheckChange = (data) => {
	if (data.children.length > 0 && node) {
		ElMessage.warning("无法删除当前包含子节点的部门，请先删除子部门");
		return
	}
	const node = treeRef.value.getCheckedNodes(false, false)
	treeChecked.value = node
	departmentIDs.value = treeChecked.value.map((item) => item.value).join(",");
	deleteDepartmentButtonDisabled.value = (treeChecked.value.length == 0);
}


//搜索
const search = () => {
	getUserList();
}
//清除搜索
const clear = () => {
	const departmentID = user.value.department.id;
	user.value = {
		username: "",
		name: "",
		no: "",
		department: {
			id: departmentID,
		},
		page: {
			pageNo: 1,
			pageSize: 20,
			orderBy: ""
		}
	}
	getUserList();
}
//表单重置
const resetForm = () => {
	userForm.value = {
		id: "",
		username: "",
		name: "",
		no: "",
		department: {
			id: "",
		},
		role: "",
		version: "",
	}
	departmentForm.value = {
		id: "",
		name: "",
		parent: {
			id: "",
		},
		version: "",
	}
}

//新增用户
const addUser = () => {
	resetForm()
	userDialogVisible.value = true;
	dialogTitle.value = "新建用户";
	usernameDisabled.value = false;
}
//编辑用户
const editUser = (row) => {
	userForm.value.id = row.id;
	userForm.value.username = row.username;
	userForm.value.name = row.name;
	userForm.value.no = row.no;
	userForm.value.department = row.department;
	userForm.value.version = row.version;
	userDialogVisible.value = true;
	dialogTitle.value = editButtonText.value + "用户";
}
//删除用户
const deleteUser = (row) => {
	ElMessageBox.confirm("确定删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		if (store.user.id == row.id) {
			ElMessage.error("无法删除该账号");
			return
		}
		if (row.id != undefined) {
			userIDs.value = row.id;
		}
		if (userIDs.value == "") {
			return
		}
		userAPI.delete(userIDs.value).then((res) => {
			ElMessage.success("删除成功");
			getUserList();
		}).catch(() => {
			ElMessage.error("删除失败");
		});
	}).catch(() => { })
}

//新增部门
const addDepartment = () => {
	resetForm()
	departmentDialogVisible.value = true;
	dialogTitle.value = "新建部门";
}
//编辑部门
const editDepartment = (row) => {
	departmentForm.value.id = row.value;
	departmentForm.value.name = row.label;
	departmentForm.value.parent.id = row.parent;
	departmentForm.value.version = row.version;
	departmentDialogVisible.value = true;
	dialogTitle.value = editButtonText.value + "部门";
}
//删除部门
const deleteDepartment = (node, data) => {
	ElMessageBox.confirm("确定要删除吗？", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(() => {
		if (node.data && node.data.value != undefined) {
			departmentIDs.value = node.data.value;
			treeChecked.value.push(node);
		}
		if (departmentIDs.value == "") {
			return
		}
		departmentAPI.delete(departmentIDs.value).then((res) => {
			ElMessage.success("删除成功");
			treeChecked.value.forEach(item => {
				treeRef.value.remove(item);
			});
		}).catch(() => {
			ElMessage.error("删除失败");
		});
	}).catch((error) => {
		console.log(error);
	})
}

//提交新增、编辑
const submit = (type) => {
	submitButtonLoading.value = true;
	submitButtonText.value = "提交中";
	if (type == "user") {
		userAPI.save(userForm.value).then((res) => {
			if (dialogTitle.value == "编辑用户") {
				ElMessage.success("更新用户成功");
			} else if (dialogTitle.value == "新建用户") {
				ElMessage.success("新建用户成功");
			}
			userDialogVisible.value = false;
			getUserList();
		}).catch((error) => {
			console.log(error);
		})
	} else if (type == "department") {
		console.log(departmentForm.value);
		departmentAPI.save(departmentForm.value).then((res) => {
			if (dialogTitle.value == "编辑部门") {
				ElMessage.success("更新部门成功");
			} else if (dialogTitle.value == "新建部门") {
				ElMessage.success("新建部门成功");
			}
			departmentDialogVisible.value = false;
			list();
		}).catch((error) => {
			console.log(error);
		})
	}
	submitButtonLoading.value = false;
	submitButtonText.value = "提交";
}

//获取用户列表
const getUserList = () => {
	userLoading.value = true;
	userAPI.list(user.value).then((res) => {
		tableData.value = res.data.page.list
		total.value = res.data.page.count;
		userLoading.value = false;
	});
};

//获取部门列表
const list = () => {
	departmentLoading.value = true;
	departmentAPI.list(department.value).then((res) => {
		treeData.value = buildTree(res.data.page.list);
		departmentLoading.value = false;
	});
};

//刷新表格
const refreshTable = () => {
	user.value.page.pageNo = 1;
	pageNo.value = 1;
	getUserList();
};

//处理每页大小变化
const handleSizeChange = (value) => {
	user.value.page.pageSize = value;
	if (pageNo.value * value > total.value) {
		pageNo.value = Math.ceil(total.value / value);
		user.value.page.pageNo = pageNo.value;
	}
	getUserList();
};
//处理页码改变
const handleCurrentChange = (value) => {
	user.value.page.pageNo = value;
	getUserList();
};

//处理多选改变
const handleSelectionChange = (value) => {
	deleteUserButtonDisabled.value = value.length == 0;
	userIDs.value = value.map((item) => item.id).join(",");
}
//处理排序改变
const handleSortChange = (column, prop, order) => {
	if (column.order != null) {
		if (getTextType(column.prop) == "CamelCase") {
			column.prop = column.prop.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
		} else if (getTextType(column.prop) == "DotSeparated") {
			column.prop = `${column.prop.split('.')[0][0]}.${column.prop.split('.')[1]}`
		}
		column.order = column.order.replace(/ending/, "");
		user.value.page.orderBy = `${column.prop} ${column.order}`;
	} else {
		user.value.page.orderBy = ""
	}
	getUserList();
}

//获取文本类型
const getTextType = (value) => {
	const camelCaseRegex = /^[a-z]+([A-Z][a-z]*)*$/;
	const dotSeparatedRegex = /^[a-z]+(\.[a-z]+)*$/;

	if (camelCaseRegex.test(value)) {
		return 'CamelCase';
	} else if (dotSeparatedRegex.test(value)) {
		return 'DotSeparated';
	}
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

.drawer:deep(.el-drawer__header) {
	margin-bottom: 0
}

.tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.blue-text-button {
	color: var(--el-color-primary)
}
</style>
<template>
	<el-container class="container">
		<el-aside class="tree">
			<el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
			<el-tree ref="treeRef" :data="treeData" highlight-current @node-click="handleNodeClick"
				:filter-node-method="filterNode" />
		</el-aside>
		<el-main class="main">
			<el-row class="toolbar">
				<div>
					<el-button type="primary">新建</el-button>
					<el-button type="warning" plain>修改</el-button>
					<el-button type="danger" plain>删除</el-button>
				</div>
				<el-button-group>
					<el-button type="default">导入</el-button>
					<el-button type="default">导出</el-button>
					<el-button type="default" @click="refreshTable">刷新</el-button>
				</el-button-group>
			</el-row>
			<el-table class="table" :data="tableData" stripe v-loading="loading">
				<el-table-column type="selection" header-align="center" align="center" width="50" />
				<el-table-column prop="username" label="用户名" show-overflow-tooltip width="180" />
				<el-table-column prop="name" label="姓名" show-overflow-tooltip width="180" />
				<el-table-column prop="department" label="部门" show-overflow-tooltip />
				<el-table-column fixed="right" label="操作" width="120">
					<template #default>
						<el-button link type="primary" size="small" @click="">
							编辑
						</el-button>
						<el-button link type="primary" size="small">
							删除
						</el-button>
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
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import useStore from "@/store/index";
const store = useStore();

import userAPI from "@/api/User";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);
const loading = ref(false);
const pageNo = ref(1);
const pageSize = ref(10);
const total = ref(100);

const user = ref({
	department: {
		id: "",
	},
	page: {
		pageNo: 1,
		pageSize: 10
	}
});


onMounted(() => {
	if (store.userList.count == undefined) {
		getUserList();
	} else {
		total.value = store.userList.count;
	}
	tableData.value = store.userList;
	treeData.value = store.departmentList;
});

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
		user.value.department.id = data.id;
		getUserList();
	}
};

const getUserList = () => {
	loading.value = true;
	userAPI.getUserList(user.value).then((res) => {
		tableData.value = [];
		res.data.page.list.forEach((element) => {
			let item = {
				username: element.username,
				name: element.name,
				department: element.department.name,
			};
			tableData.value.push(item);
		});
		total.value = res.data.page.count;
		loading.value = false;
	});
};

const refreshTable = () => {
	user.value.page.pageNo = 1;
	pageNo.value = 1;
	getUserList();
};

const handleSizeChange = (value) => {
	user.value.page.pageSize = value;
	getUserList();
};

const handleCurrentChange = (value) => {
	user.value.page.pageNo = value;
	getUserList();
};
</script>

<style scoped>
.container {
	height: calc(100vh - 52px);
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
	height: calc(100vh - 200px);
	margin-bottom: 2%;
}

.pagination {
	display: flex;
	justify-content: right;
}
</style>

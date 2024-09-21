<template>

    <el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
    <el-tree ref="treeRef" :data="treeData" highlight-current @node-click="handleNodeClick"
        :filter-node-method="filterNode" v-loading="departmentLoading" />

</template>

<script setup>
import { ref, onMounted, watch, version } from "vue";

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
const pageSize = ref(20);
const total = ref(0);

const dialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const usernameDisabled = ref(true);
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
        pageSize: 20
    }
});

const department = ref({
    page: {
        pageNo: 1,
        pageSize: 20
    }
});

const form = ref({
    id: "",
    username: "",
    name: "",
    department: {
        id: "",
    },
    role: "",
    version: "",
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
            pageSize: 20
        }
    }
    getUserList();
}

const resetForm = () => {
    form.value = {
        id: "",
        username: "",
        name: "",
        department: {
            id: "",
        },
        role: "",
        version: "",
    }
}

const add = () => {
    resetForm()
    dialogVisible.value = true;
    dialogTitle.value = "新建";
    usernameDisabled.value = false;
}

const edit = (row) => {
    form.value.id = row.id;
    form.value.username = row.username;
    form.value.name = row.name;
    form.value.department = row.department;
    form.value.version = row.version;
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
        if (dialogTitle.value == "编辑") {
            ElMessage.success("更新成功");
        } else if (dialogTitle.value == "新建") {
            ElMessage.success("新建成功");
        }
        dialogVisible.value = false;
        getUserList();
    })
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
                version: element.version
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

const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        column.order = column.order.replace(/ending/, "");
        user.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        user.value.page.orderBy = ""
    }
    getUserList();
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

<template>
    <el-container class="container">
        <el-main>
            <el-row class="toolbar">
                <el-button type="default" @click="refreshTable">刷新</el-button>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="userLoading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="id" label="id" width="80" />
                <el-table-column prop="name" label="角色名称" show-overflow-tooltip sortable="custom" width="180" />
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
                <el-col :span="8">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username" placeholder="请填写用户名"
                            :disabled="usernameDisabled || roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name" placeholder="请填写姓名" :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
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


</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import certificationAPI from "@/api/certification";
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

const userDialogVisible = ref(false);
const departmentDialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const usernameDisabled = ref(true);
const deleteUserButtonDisabled = ref(true);
const deleteDepartmentButtonDisabled = ref(true);

const drawerVisible = ref(false);

const userIDs = ref("");
const departmentIDs = ref("");

const editButtonText = computed(() => {
    if (store.roleLevel == 1) {
        return "编辑";
    } else {
        return "查看";
    }
});

const roleLevelBoolean = computed(() => {
    if (store.roleLevel == 1) {
        return false;
    } else {
        return true;
    }
});

const certification = ref({
    id: ""
});

onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=RenYuan";
        return
    }
    certificationAPI.getCertificationList(certification.value).then((res) => {
        console.log(res);
    }).then(() => {

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
    userForm.value = {
        id: "",
        username: "",
        name: "",
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

const addUser = () => {
    resetForm()
    userDialogVisible.value = true;
    dialogTitle.value = "新建用户";
    usernameDisabled.value = false;
}

const editUser = (row) => {
    userForm.value.id = row.id;
    userForm.value.username = row.username;
    userForm.value.name = row.name;
    userForm.value.department = row.department;
    userForm.value.version = row.version;
    userDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "用户";
}

const deleteUser = (row) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
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

const addDepartment = () => {
    resetForm()
    departmentDialogVisible.value = true;
    dialogTitle.value = "新建部门";
}

const editDepartment = (row) => {
    departmentForm.value.id = row.value;
    departmentForm.value.name = row.label;
    departmentForm.value.parent.id = row.parent;
    departmentForm.value.version = row.version;
    departmentDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "部门";
}

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
            // getDepartmentList();
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch((error) => {
        console.log(error);
    })
}


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
            getDepartmentList();
        }).catch((error) => {
            console.log(error);
        })
    }
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

const getDepartmentList = () => {
    departmentLoading.value = true;
    departmentAPI.getDepartmentList(department.value).then((res) => {
        treeData.value = buildTree(res.data.page.list);
        departmentLoading.value = false;
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
    deleteUserButtonDisabled.value = value.length == 0;
    userIDs.value = value.map((item) => item.id).join(",");
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

const treeChecked = ref([])
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

</script>

<style scoped>
.container {
    height: calc(100vh - 52px);
}

.toolbar {
    display: flex;
    justify-content: right;
    margin-bottom: 1%;
}

.table {
    height: calc(100vh - 214px);
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
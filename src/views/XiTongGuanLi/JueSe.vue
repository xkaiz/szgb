<template>

    <el-container class="container">
        <el-main class="main">
            <el-row class="search">
                <el-row class="search-item">
                    <el-input v-model="role.name" placeholder="角色名称" clearable />
                </el-row>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="clear">重置</el-button>
            </el-row>
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addRole" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteRoleButtonDisabled" @click="deleteRole"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <el-button-group>
                    <el-button type="default" @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="loading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="id" label="id" width="80" v-if="false" />
                <el-table-column prop="name" label="角色名称" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="" label="菜单权限" show-overflow-tooltip sortable="custom" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editRole(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteRole(scope.row)"
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
    <el-dialog v-model="roleDialogVisible" :title="dialogTitle" width="30%" draggable overflow v-if="roleDialogVisible"
        :close-on-click-modal="false">
        <el-form :model="roleForm" :rules="rules" ref="formRef">
            <el-form-item label="角色名称" prop="name" required>
                <el-input v-model="roleForm.name" placeholder="请填写角色名称" :disabled="roleLevelBoolean"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="menus" required>
                <el-cascader v-model="roleForm.menus" :options="routerOptions" :props="props" collapse-tags
                    collapse-tags-tooltip clearable :disabled="roleLevelBoolean" style="width: 100%;" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="roleDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit()" :loading="submitButtonLoading" v-if="!roleLevelBoolean">
                    {{ submitButtonText }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();
import { useRouter } from "vue-router";

import roleAPI from "@/api/Role";
import { ElMessage, ElMessageBox } from "element-plus";

const tableData = ref([]);
const loading = ref(true);
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

const roleDialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const deleteRoleButtonDisabled = ref(true);

const roleIDs = ref("");

const routerOptions = ref([]);
const props = { multiple: true };

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

const role = ref({
    name: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

const roleForm = ref({
    id: "",
    name: "",
    menus: [],
    version: ""
});

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: "请输入角色名称", trigger: "blur" },
    ],
}


onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=JueSe";
        return
    }
    const routes = useRouter().getRoutes()
    routes.forEach(element => {
        if (element.children.length > 0 && element.meta.title != "首页") {
            routerOptions.value.push({
                value: element.meta.title,
                label: element.meta.title,
                children: element.children.map(child => {
                    return { value: child.meta.title, label: child.meta == undefined ? "" : child.meta.title }
                })
            });
        }
    });
    getList()
});

const search = () => {
    getList();
}

const clear = () => {
    role.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20,
            orderBy: ""
        }
    }
    getList();
}

const resetForm = () => {
    roleForm.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20,
            orderBy: ""
        }
    }
}

const addRole = () => {
    resetForm()
    roleDialogVisible.value = true;
    dialogTitle.value = "新建角色";
}

const editRole = (row) => {
    roleForm.value.id = row.id;
    roleForm.value.name = row.name;
    roleForm.value.version = row.version;
    roleDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "角色";
}

const deleteRole = (row) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (row.id != undefined) {
            roleIDs.value = row.id;
        }
        if (roleIDs.value == "") {
            return
        }
        roleAPI.delete(roleIDs.value).then((res) => {
            ElMessage.success("删除成功");
            getList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const submit = () => {
    roleForm.value.menus = roleForm.value.menus.map(item => item.toString().replace(/,/g, "/")).join(",");
    console.log(roleForm.value);
    // formRef.value.validate((valid) => {
    //     if (valid) {
    //         submitButtonLoading.value = true;
    //         submitButtonText.value = "提交中";
    //         roleAPI.save(roleForm.value).then((res) => {
    //             ElMessage.success("提交成功");
    //             roleDialogVisible.value = false;
    //             getList();
    //         }).catch(() => {
    //             ElMessage.error("提交失败");
    //         });
    //         submitButtonLoading.value = false;
    //         submitButtonText.value = "提交";
    //     }
    // })

}
const getList = () => {
    loading.value = true;
    roleAPI.list(role.value).then((res) => {
        store.setRole(res.data.page.list);
        total.value = res.data.page.count;
        tableData.value = res.data.page.list;
        loading.value = false;
    });
};

//刷新表格
const refreshTable = () => {
    role.value.page.pageNo = 1;
    pageNo.value = 1;
    getList();
};

//处理每页大小变化
const handleSizeChange = (value) => {
    role.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        role.value.page.pageNo = pageNo.value;
    }
    getList();
};

//处理页码改变
const handleCurrentChange = (value) => {
    role.value.page.pageNo = value;
    getList();
};

//处理多选改变
const handleSelectionChange = (value) => {
    deleteRoleButtonDisabled.value = value.length == 0;
    roleIDs.value = value.map((item) => item.id).join(",");
}

//处理排序改变
const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        column.order = column.order.replace(/ending/, "");
        role.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        role.value.page.orderBy = ""
    }
    getList();
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
    height: calc(100vh - 260px);
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
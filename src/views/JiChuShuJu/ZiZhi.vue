<template>

    <el-container class="container">
        <el-main class="main">
            <el-row class="search">
                <el-row class="search-item">
                    <UserSelect ref="userSelectRef" @model="setModel" />
                </el-row>
                <el-row class="search-item">
                    <CertificationSelect ref="certificationSelectRef" @model="setModel" />
                </el-row>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="clear">重置</el-button>
            </el-row>
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="add" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteButtonDisabled" @click="del"
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
                <el-table-column prop="user.name" label="姓名" show-overflow-tooltip width="180" sortable="custom" />
                <el-table-column prop="certification.name" label="证书名称" show-overflow-tooltip sortable="custom" />
                <el-table-column prop="gotAt" label="获得时间" show-overflow-tooltip sortable="custom" />
                <el-table-column prop="expiredAt" label="到期时间" show-overflow-tooltip sortable="custom" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="edit(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="del(scope.row)"
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" draggable overflow>
        <el-form :model="userCertificationForm">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="user.id">
                        <UserSelect @model="setModel" :id="userCertificationForm.user.id" v-if="dialogVisible" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="证书名称" prop="certification.name">
                        <CertificationSelect @model="setModel" :id="userCertificationForm.certification.id"
                            v-if="dialogVisible" @change="list" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="获得时间" prop="gotAt">
                        <el-date-picker v-model="userCertificationForm.gotAt" type="date" placeholder="请输入获得时间"
                            @change="handleGotAtChange" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="到期时间" prop="expiredAt">
                        <el-date-picker v-model="userCertificationForm.expiredAt" type="date" placeholder="根据证书名称自动计算"
                            disabled />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
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

import userCertificationAPI from "@/api/UserCertification";
import certificationAPI from "@/api/Certification";
import { ElMessage, ElMessageBox } from "element-plus";
import UserSelect from "@/components/UserSelect.vue";
import CertificationSelect from "@/components/CertificationSelect.vue";

const tableData = ref([]);
const loading = ref(true);
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

const dialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const deleteButtonDisabled = ref(true);

const IDs = ref("");

const userSelectRef = ref(null);
const certificationSelectRef = ref(null);

const setModel = (value) => {
    userCertificationForm.value[value.type].id = value.id;
    console.log(userCertificationForm.value);
}


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

const userCertificationForm = ref({
    id: "",
    user: {
        id: "",
        name: ""
    },
    certification: {
        id: "",
        name: "",
    },
    expiredAt: "",
    gotAt: "",
    version: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});


onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=ZiZhi";
        return
    }
    getList();
});

const search = () => {
    getList();
}

const clear = () => {
    userSelectRef.value.clear();
    certificationSelectRef.value.clear();
    resetForm();
    getList();
}

const resetForm = () => {
    userCertificationForm.value = {
        id: "",
        user: {
            id: "",
            name: ""
        },
        certification: {
            id: "",
            name: "",
        },
        expiredAt: "",
        gotAt: "",
        version: "",
        page: {
            pageNo: 1,
            pageSize: 20,
            orderBy: ""
        }
    }
}

const add = () => {
    resetForm()
    dialogVisible.value = true;
    dialogTitle.value = "新建用户资质";
}

const edit = (row) => {
    userCertificationForm.value.id = row.id;
    userCertificationForm.value.user.id = row.user.id;
    userCertificationForm.value.user.name = row.user.name;
    userCertificationForm.value.certification.id = row.certification.id;
    userCertificationForm.value.certification.name = row.certification.name;
    userCertificationForm.value.gotAt = row.gotAt;
    userCertificationForm.value.expiredAt = row.expiredAt;
    userCertificationForm.value.version = row.version;
    dialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "用户资质";
}

const del = (row) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (row.id != undefined) {
            IDs.value = row.id;
        }
        if (IDs.value == "") {
            return
        }
        userCertificationAPI.delete(IDs.value).then((res) => {
            ElMessage.success("删除成功");
            getList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const submit = () => {
    userCertificationForm.value.gotAt = formatDate(new Date(userCertificationForm.value.gotAt), 1, 0)
    userCertificationForm.value.expiredAt = formatDate(new Date(userCertificationForm.value.expiredAt), 1, 0)
    submitButtonLoading.value = true;
    submitButtonText.value = "提交中";
    userCertificationAPI.save(userCertificationForm.value).then((res) => {
        ElMessage.success("提交成功");
        dialogVisible.value = false;
        getList();
    }).catch((error) => {
        console.log(error);
        ElMessage.error("提交失败");
    });
    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}
const getList = () => {
    loading.value = true;
    userCertificationAPI.list(userCertificationForm.value).then((res) => {
        res.data.page.list.map((item) => {
            item.gotAt = formatDate(new Date(item.gotAt), 1)
            item.expiredAt = formatDate(new Date(item.expiredAt), 1)
        });
        store.setUserCertification(res.data.page.list);
        total.value = res.data.page.count;
        tableData.value = res.data.page.list;
        loading.value = false;
    });
};

const formatDate = (date, num, type) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + num).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` + (type == 0 ? " 00:00:00" : "");
};


const refreshTable = () => {
    userCertificationForm.value.page.pageNo = 1;
    pageNo.value = 1;
    getList();
};

const handleSizeChange = (value) => {
    userCertificationForm.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        userCertificationForm.value.page.pageNo = pageNo.value;
    }
    getList();
};

const handleCurrentChange = (value) => {
    userCertificationForm.value.page.pageNo = value;
    getList();
};

const handleSelectionChange = (value) => {
    deleteButtonDisabled.value = value.length == 0;
    IDs.value = value.map((item) => item.id).join(",");
}

const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        if (getTextType(column.prop) == "CamelCase") {
            column.prop = column.prop.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        } else if (getTextType(column.prop) == "DotSeparated") {
            column.prop = `${column.prop.split('.')[0][0]}.${column.prop.split('.')[1]}`
        }
        column.order = column.order.replace(/ending/, "");
        userCertificationForm.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        userCertificationForm.value.page.orderBy = ""
    }
    console.log(userCertificationForm.value);
    getList();
}


const getTextType = (value) => {
    const camelCaseRegex = /^[a-z]+([A-Z][a-z]*)*$/;
    const dotSeparatedRegex = /^[a-z]+(\.[a-z]+)*$/;

    if (camelCaseRegex.test(value)) {
        return 'CamelCase';
    } else if (dotSeparatedRegex.test(value)) {
        return 'DotSeparated';
    }
}

const handleGotAtChange = (value) => {
    userCertificationForm.value.gotAt = formatDate(value, 1, 0);
    getUserCertification()
}

const getUserCertification = () => {
    if (userCertificationForm.value.gotAt != "") {
        certificationAPI.getById(userCertificationForm.value.certification).then((res) => {
            let period = res.data.data.period;
            if (period == -1) {
                userCertificationForm.value.expiredAt = formatDate(new Date("2999/1/1"), 1, 0)
            } else {
                userCertificationForm.value.expiredAt = formatDate(new Date(new Date(userCertificationForm.value.gotAt).getTime() + period * 24 * 60 * 60 * 1000), 0, 0)
            }
        });
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
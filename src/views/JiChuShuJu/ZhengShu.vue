<template>

    <el-container class="container">
        <el-main class="main">
            <el-row class="search">
                <el-row class="search-item">
                    <el-input v-model="certification.name" placeholder="角色名称" clearable />
                </el-row>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="primary" @click="clear">重置</el-button>
            </el-row>
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addCertification" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteCertificationButtonDisabled"
                        @click="deleteCertification" v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <el-button-group>
                    <el-button type="default" @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="loading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="id" label="id" width="80" />
                <el-table-column prop="name" label="证书名称" show-overflow-tooltip sortable="custom" width="180" />
                <el-table-column prop="period" label="期限" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editCertification(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteCertification(scope.row)"
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
    <el-dialog v-model="certificationDialogVisible" :title="dialogTitle" width="30%" draggable overflow>
        <el-form :model="certificationForm">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="证书名称" prop="name">
                        <el-input v-model="certificationForm.name" placeholder="请填写证书名称"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="期限" prop="period">
                        <el-select v-model="certificationForm.period" placeholder="请选择期限" style="width: 240px">
                            <el-option v-for="item in peroidOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="certificationDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
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

import certificationAPI from "@/api/Certification";
import { ElMessage, ElMessageBox } from "element-plus";
import { get } from "@vueuse/core";

const tableData = ref([]);
const loading = ref(true);
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

const certificationDialogVisible = ref(false);
const dialogTitle = ref("");

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const deleteCertificationButtonDisabled = ref(true);

const certificationIDs = ref("");

const peroidOptions = [
    { label: "无期限", value: -1 },
    { label: "一个月", value: 30 },
    { label: "三个月", value: 90 },
    { label: "六个月", value: 180 },
    { label: "一年", value: 365 },
    { label: "两年", value: 730 },
    { label: "三年", value: 1095 },
    { label: "四年", value: 1460 },
    { label: "五年", value: 1825 },
    { label: "六年", value: 2190 },
]

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
    name: "",
    period: "",
    page: {
        pageNo: 1,
        pageSize: 20
    }
});

const certificationForm = ref({
    id: "",
    name: "",
    period: "",
    version: ""
});


onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=RenYuan";
        return
    }
    getCertificationList();
});

const search = () => {
    getCertificationList();
}

const clear = () => {
    certification.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20
        }
    }
    getCertificationList();
}

const resetForm = () => {
    certificationForm.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20
        }
    }
}

const addCertification = () => {
    resetForm()
    certificationDialogVisible.value = true;
    dialogTitle.value = "新建证书";
}

const editCertification = (row) => {
    certificationForm.value.id = row.id;
    certificationForm.value.name = row.name;
    certificationForm.value.version = row.version;
    certificationDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "证书";
}

const deleteCertification = (row) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (row.id != undefined) {
            certificationIDs.value = row.id;
        }
        if (certificationIDs.value == "") {
            return
        }
        certificationAPI.delete(certificationIDs.value).then((res) => {
            ElMessage.success("删除成功");
            getCertificationList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const submit = () => {
    submitButtonLoading.value = true;
    submitButtonText.value = "提交中";
    certificationAPI.save(certificationForm.value).then((res) => {
        ElMessage.success("提交成功");
        certificationDialogVisible.value = false;
        getCertificationList();
    }).catch(() => {
        ElMessage.error("提交失败");
    });
    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}
const getCertificationList = () => {
    loading.value = true;
    certificationAPI.getCertificationList(certification.value).then((res) => {
        res = formatPeriod(res)
        store.setCertification(res.data.page.list);
        total.value = res.data.page.count;
        tableData.value = res.data.page.list;
        loading.value = false;
    });
};

const formatPeriod = (res) => {
    res.data.page.list.map((item) => {
        if (item.period == -1) {
            item.period = "无期限";
        } else if (item.period <= 365) {
            item.period = `${item.period}天`;
        } else if (item.period > 365) {
            item.period = `${Math.floor(item.period / 365)}年`;
        }
    })
    return res
}

const refreshTable = () => {
    certification.value.page.pageNo = 1;
    pageNo.value = 1;
    getCertificationList();
};

const handleSizeChange = (value) => {
    user.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        user.value.page.pageNo = pageNo.value;
    }
    getCertificationList();
};

const handleCurrentChange = (value) => {
    user.value.page.pageNo = value;
    getCertificationList();
};

const handleSelectionChange = (value) => {
    deleteCertificationButtonDisabled.value = value.length == 0;
    certificationIDs.value = value.map((item) => item.id).join(",");
}

const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        column.order = column.order.replace(/ending/, "");
        user.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        user.value.page.orderBy = ""
    }
    getCertificationList();
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
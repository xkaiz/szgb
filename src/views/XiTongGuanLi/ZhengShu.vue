<template>

    <el-container class="container">
        <el-main class="main">
            <el-row class="search">
                <el-row class="search-item">
                    <el-input v-model="certification.name" placeholder="证书名称" clearable />
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
                <el-table-column prop="name" label="证书名称" show-overflow-tooltip sortable="custom" width="180" />
                <el-table-column prop="period" label="期限" show-overflow-tooltip sortable="custom" />
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" draggable overflow
        :close-on-click-modal="false">
        <el-form :model="certificationForm" :rules="rules" ref="formRef">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="证书名称" prop="name" required>
                        <el-input v-model="certificationForm.name" placeholder="请填写证书名称"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="期限" prop="period" required>
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

import certificationAPI from "@/api/Certification";
import { ElMessage, ElMessageBox } from "element-plus";

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

const peroidOptions = ref([])

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

const dict = ref({
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

const certification = ref({
    name: "",
    period: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

const certificationForm = ref({
    id: "",
    name: "",
    period: "",
    version: ""
});

const formRef = ref(null);

const rules = {
    name: [
        { required: true, message: "请输入证书名称", trigger: "blur" }
    ],
    period: [
        { required: true, message: "请选择期限", trigger: "change" }
    ]
}


onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=ZhengShu";
        return
    }

    peroidOptions.value = store.dict.find(item => item.label == "证书期限").dictChildren;
    getList();
});

const search = () => {
    getList();
}

const clear = () => {
    certification.value = {
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
    certificationForm.value = {
        id: "",
        name: "",
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
    dialogTitle.value = "新建证书";
}

const edit = (row) => {
    certificationForm.value.id = row.id;
    certificationForm.value.name = row.name;
    certificationForm.value.version = row.version;
    dialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "证书";
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
        certificationAPI.delete(IDs.value).then((res) => {
            ElMessage.success("删除成功");
            getList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const submit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            submitButtonLoading.value = true;
            submitButtonText.value = "提交中";
            certificationAPI.save(certificationForm.value).then((res) => {
                ElMessage.success("提交成功");
                dialogVisible.value = false;
                getList();
            }).catch(() => {
                ElMessage.error("提交失败");
            });
            submitButtonLoading.value = false;
            submitButtonText.value = "提交";
        }
    })
}

//获取证书列表
const getList = () => {
    loading.value = true;
    certificationAPI.list(certification.value).then((res) => {
        res = formatPeriod(res)
        store.setCertification(res.data.page.list);
        total.value = res.data.page.count;
        tableData.value = res.data.page.list;
        loading.value = false;
    });
};

//格式化期限
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

//刷新表格
const refreshTable = () => {
    certification.value.page.pageNo = 1;
    pageNo.value = 1;
    getList();
};

//处理每页大小变化
const handleSizeChange = (value) => {
    certification.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        certification.value.page.pageNo = pageNo.value;
    }
    getList();
};

//处理页码改变
const handleCurrentChange = (value) => {
    certification.value.page.pageNo = value;
    getList();
};

//处理多选改变
const handleSelectionChange = (value) => {
    deleteButtonDisabled.value = value.length == 0;
    IDs.value = value.map((item) => item.id).join(",");
}

//处理排序改变
const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        column.order = column.order.replace(/ending/, "");
        certification.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        certification.value.page.orderBy = ""
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
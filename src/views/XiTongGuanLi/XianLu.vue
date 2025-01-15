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
                :filter-node-method="filterNode" v-loading="lineLoading" default-expand-all
                :expand-on-click-node="false" node-key="value" />
        </el-aside>
        <el-main class="main">
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addLineChildren" v-if="!roleLevelBoolean"
                        :disabled="addLineButtonDisabled">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteLineButtonDisabled" @click="deleteLineChildren"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <el-button-group>
                    <el-button type="default" :disabled="refreshTableButtonDisabled"
                        @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="lineChildrenLoading"
                @selection-change="handleSelectionChange" row-key="id">
                <el-table-column type="selection" header-align="center" align="center" />
                <el-table-column prop="id" label="id" width="80" align="center" v-if="false" />
                <el-table-column prop="line" label="线路" align="center" width="150" />
                <el-table-column prop="name" label="站点" align="center" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editLineChildren(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteLineChildren(scope.row)"
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
    <el-dialog v-model="lineChildrenDialogVisible" :title="dialogTitle" width="30%" draggable overflow
        :close-on-click-modal="false">
        <el-form :model="lineChildrenForm" ref="lineChildrenFormRef" :rules="lineChildrenRules">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="键" prop="label" required>
                        <el-input v-model="lineChildrenForm.label" placeholder="请填写键"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="值" prop="value" required>
                        <el-input v-model="lineChildrenForm.value" placeholder="请填写值"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="lineChildrenDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('lineChildren')" :loading="submitButtonLoading"
                    v-if="!roleLevelBoolean">
                    {{ submitButtonText }}
                </el-button>
            </div>
        </template>
    </el-dialog>

    <div class="drawer">
        <el-drawer v-model="drawerVisible" direction="ltr" size="30%" :close-on-click-modal="false">
            <template #header>
                <h3>线路数据管理</h3>
            </template>
            <template #default>
                <el-row :gutter="5">
                    <el-col :span="18">
                        <el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="addLine()" v-if="!roleLevelBoolean">新增</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="danger" plain :disabled="deleteLineButtonDisabled" v-if="!roleLevelBoolean"
                            @click="deleteLineChildren(lineChildrenIDs)">删除</el-button>
                    </el-col>
                </el-row>
                <el-tree ref="treeRef" :data="treeData" highlight-current :filter-node-method="filterNode" show-checkbox
                    @check-change="handleCheckChange" v-loading="lineLoading" check-strictly node-key="value"
                    default-expand-all>
                    <template #default="{ node, data }">
                        <span class="tree-node">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button class="blue-text-button" link @click="editLine(data, $event);
                                $event.stopPropagation()">{{ editButtonText }}</el-button>
                                <el-button class="blue-text-button" link @click="deleteLine(node, data, $event);
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
    <el-dialog v-model="lineDialogVisible" :title="dialogTitle" width="30%" draggable overflow
        :close-on-click-modal="false">
        <el-form :model="lineForm" ref="lineFormRef" :rules="lineRules">
            <el-form-item label="线路数据名称" prop="name" required>
                <el-input v-model="lineForm.name" placeholder="请填写线路数据名称" :disabled="roleLevelBoolean"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="lineDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('line')" :loading="submitButtonLoading"
                    v-if="!roleLevelBoolean">
                    {{ submitButtonText }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed, nextTick } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import lineAPI from "@/api/Line";
import lineChildrenAPI from "@/api/LineChildren";
import { buildTree } from "@/utils/BuildTree";
import { ElMessage, ElMessageBox } from "element-plus";
import { getLines } from "@/utils/Line";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);

//加载状态
const lineChildrenLoading = ref(true);
const lineLoading = ref(true);
const submitButtonLoading = ref(false);

//组件显示
const lineDialogVisible = ref(false);
const lineChildrenDialogVisible = ref(false);
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
const addLineButtonDisabled = ref(true);
const deleteLineButtonDisabled = ref(true);
const refreshTableButtonDisabled = ref(true);
const deleteLineChildrenButtonDisabled = ref(true);

//线路数据树相关
const treeChecked = ref([])

//线路和线路数据被多选选中的id
const lineIDs = ref("");
const lineChildrenIDs = ref("");

//分页相关
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

//线路和线路数据表单规则相关
const lineChildrenFormRef = ref(null);
const lineFormRef = ref(null);

const lineChildrenRules = ref({
    label: [
        { required: true, message: "键不能为空", trigger: "blur" },
    ],
    value: [
        { required: true, message: "值不能为空", trigger: "blur" },
    ]
});

const lineRules = ref({
    name: [
        { required: true, message: "线路数据名称不能为空", trigger: "blur" },
    ],
});


//根据角色等级判断是否显示相关按钮
const roleLevelBoolean = computed(() => {
    if (store.roleLevel == 1) {
        return false;
    } else {
        return true;
    }
});

//线路查询
const line = ref({
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//线路数据查询
const lineChildren = ref({
    line: {
        id: ""
    },
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//线路表单
const lineForm = ref({
    id: "",
    name: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//线路数据表单
const lineChildrenForm = ref({
    id: "",
    line: {
        id: ""
    },
    label: "",
    value: "",
    version: "",
});

onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=ZiDian";
        return
    }
    getLineList();
    lineChildrenLoading.value = false
});

//处理线路数据树节点点击
const handleNodeClick = (data) => {
    addLineButtonDisabled.value = false
    store.line.map((item) => {
        if (item.value == data.value) {
            tableData.value = item.childrenData;
            tableData.value.forEach((item) => {
                item.line = data.label;
            });
            lineChildrenForm.value.line.id = item.value
            refreshTableButtonDisabled.value = false
        }
    })
    if (tableData.value == null) {
        refreshTableButtonDisabled.value = true
    }

};
//线路树筛选
const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
//线路树筛选文本监听
watch(filterText, (value) => {
    treeRef.value.filter(value)
})
//处理线路树节点选中
const handleCheckChange = (data) => {
    const node = treeRef.value.getCheckedNodes(false, false)
    treeChecked.value = node
    lineIDs.value = treeChecked.value.map((item) => item.value).join(",");
    deleteLineChildrenButtonDisabled.value = (treeChecked.value.length == 0);
}

//表单重置
const resetForm = () => {
    lineForm.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20,
            orderBy: ""
        }
    }
    lineChildrenForm.value = {
        id: "",
        line: {
            id: lineChildrenForm.value.line.id
        },
        label: "",
        value: "",
        version: "",
    }
}

//新增线路
const addLine = () => {
    resetForm()
    lineDialogVisible.value = true;
    dialogTitle.value = "新建线路";
}
//编辑线路
const editLine = (row) => {
    lineForm.value.id = row.id;
    lineForm.value.name = row.name;
    lineForm.value.version = row.version;
    lineDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "线路";
}
//删除线路
const deleteLine = (node, data) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (node.data && node.data.value != undefined) {
            lineIDs.value = node.data.value;
            treeChecked.value.push(node);
        }
        if (lineIDs.value == "") {
            return
        }
        lineAPI.delete(lineIDs.value).then((res) => {
            treeChecked.value.forEach(item => {
                treeRef.value.remove(item);
            });
            ElMessage.success("删除成功");
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

//新增线路数据
const addLineChildren = () => {
    resetForm()
    lineChildrenDialogVisible.value = true;
    dialogTitle.value = "新建线路数据";
}
//编辑线路数据
const editLineChildren = (row) => {
    lineChildrenForm.value.id = row.id;
    lineChildrenForm.value.line.id = row.line.id;
    lineChildrenForm.value.label = row.label;
    lineChildrenForm.value.value = row.value;
    lineChildrenForm.value.version = row.version;
    lineChildrenDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "线路数据";
}
//删除线路数据
const deleteLineChildren = (row) => {
    ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (row.id != undefined) {
            lineChildrenIDs.value = row.id;
        }
        if (lineChildrenIDs.value == "") {
            return
        }
        lineChildrenAPI.delete(lineChildrenIDs.value).then((res) => {
            ElMessage.success("删除成功");
            getLineChildrenList(row.line.id);
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
    if (type == "line") {
        lineFormRef.value.validate((valid) => {
            if (valid) {
                lineAPI.save(lineForm.value).then((res) => {
                    if (dialogTitle.value == "编辑线路") {
                        ElMessage.success("更新线路成功");
                    } else if (dialogTitle.value == "新建线路") {
                        ElMessage.success("新建线路成功");
                    }
                    lineDialogVisible.value = false;
                    getLineList();
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    } else if (type == "lineChildren") {
        lineChildrenFormRef.value.validate((valid) => {
            if (valid) {
                lineChildrenAPI.save(lineChildrenForm.value).then((res) => {
                    if (dialogTitle.value == "编辑线路数据") {
                        ElMessage.success("更新线路数据成功");
                    } else if (dialogTitle.value == "新建线路数据") {
                        ElMessage.success("新建线路数据成功");
                    }
                    lineChildrenDialogVisible.value = false;
                    getLineChildrenList(lineChildrenForm.value.line.id);
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    }
    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}

//获取线路列表
const getLineList = () => {
    lineLoading.value = true;
    getLines().then(() => {
        treeData.value = JSON.parse(JSON.stringify(store.line));
        lineLoading.value = false;
    })
};

//获取线路数据列表
const getLineChildrenList = (lineID) => {
    lineChildrenLoading.value = true;
    getLines().then(() => {
        lineChildrenLoading.value = false;
        store.line.forEach((item) => {
            if (item.value == lineID) {
                tableData.value = item.childrenData;
            }
        })
        nextTick(() => {
            treeRef.value.setCurrentKey(lineID)
        })
    })
};

//刷新表格
const refreshTable = () => {
    lineChildren.value.page.pageNo = 1;
    pageNo.value = 1;
    getLineChildrenList();
};

//处理每页大小变化
const handleSizeChange = (value) => {
    line.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        line.value.page.pageNo = pageNo.value;
    }
    getLineList();
};
//处理页码改变
const handleCurrentChange = (value) => {
    line.value.page.pageNo = value;
    getLineList();
};

//处理多选改变
const handleSelectionChange = (value) => {
    deleteLineButtonDisabled.value = value.length == 0;
    lineChildrenIDs.value = value.map((item) => item.id).join(",");
}

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
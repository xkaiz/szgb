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
                :filter-node-method="filterNode" v-loading="dictLoading" default-expand-all
                :expand-on-click-node="false" node-key="value" />
        </el-aside>
        <el-main class="main">
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addDictChildren" v-if="!roleLevelBoolean"
                        :disabled="addDictButtonDisabled">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteDictButtonDisabled" @click="deleteDictChildren"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <el-button-group>
                    <el-button type="default" :disabled="refreshTableButtonDisabled"
                        @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="dictChildrenLoading"
                @selection-change="handleSelectionChange" row-key="id">
                <el-table-column type="selection" header-align="center" align="center" />
                <el-table-column prop="id" label="id" width="80" align="center" v-if="false" />
                <el-table-column prop="label" label="键" align="center" width="150" />
                <el-table-column prop="value" label="值" align="center" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editDictChildren(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteDictChildren(scope.row)"
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
    <el-dialog v-model="dictChildrenDialogVisible" :title="dialogTitle" width="30%" draggable overflow>
        <el-form :model="dictChildrenForm" ref="dictChildrenFormRef" :rules="dictChildrenRules">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="键" prop="label" required>
                        <el-input v-model="dictChildrenForm.label" placeholder="请填写键"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="值" prop="value" required>
                        <el-input v-model="dictChildrenForm.value" placeholder="请填写值"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dictChildrenDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('dictChildren')" :loading="submitButtonLoading"
                    v-if="!roleLevelBoolean">
                    {{ submitButtonText }}
                </el-button>
            </div>
        </template>
    </el-dialog>

    <div class="drawer">
        <el-drawer v-model="drawerVisible" direction="ltr" size="30%">
            <template #header>
                <h3>字典数据管理</h3>
            </template>
            <template #default>
                <el-row :gutter="5">
                    <el-col :span="18">
                        <el-input v-model="filterText" class="filter" placeholder="筛选" clearable />
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" @click="addDict()" v-if="!roleLevelBoolean">新增</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="danger" plain :disabled="deleteDictButtonDisabled" v-if="!roleLevelBoolean"
                            @click="deleteDictChildren(dictChildrenIDs)">删除</el-button>
                    </el-col>
                </el-row>
                <el-tree ref="treeRef" :data="treeData" highlight-current :filter-node-method="filterNode" show-checkbox
                    @check-change="handleCheckChange" v-loading="dictLoading" check-strictly node-key="value"
                    default-expand-all>
                    <template #default="{ node, data }">
                        <span class="tree-node">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button class="blue-text-button" link @click="editDict(data, $event);
                                $event.stopPropagation()">{{ editButtonText }}</el-button>
                                <el-button class="blue-text-button" link @click="deleteDict(node, data, $event);
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
    <el-dialog v-model="dictDialogVisible" :title="dialogTitle" width="30%" draggable overflow>
        <el-form :model="dictForm" ref="dictFormRef" :rules="dictRules">
            <el-form-item label="字典数据名称" prop="name" required>
                <el-input v-model="dictForm.name" placeholder="请填写字典数据名称" :disabled="roleLevelBoolean"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dictDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('dict')" :loading="submitButtonLoading"
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

import dictAPI from "@/api/Dict";
import dictChildrenAPI from "@/api/DictChildren";
import { buildTree } from "@/utils/BuildTree";
import { ElMessage, ElMessageBox } from "element-plus";
import { getDicts, isNeedUpdate } from "@/utils/Dict";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);

//加载状态
const dictChildrenLoading = ref(true);
const dictLoading = ref(true);
const submitButtonLoading = ref(false);

//组件显示
const dictDialogVisible = ref(false);
const dictChildrenDialogVisible = ref(false);
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
const addDictButtonDisabled = ref(true);
const deleteDictButtonDisabled = ref(true);
const refreshTableButtonDisabled = ref(true);
const deleteDictChildrenButtonDisabled = ref(true);

//字典数据树相关
const treeChecked = ref([])

//字典和字典数据被多选选中的id
const dictIDs = ref("");
const dictChildrenIDs = ref("");

//分页相关
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

//字典和字典数据表单规则相关
const dictChildrenFormRef = ref(null);
const dictFormRef = ref(null);

const dictChildrenRules = ref({
    label: [
        { required: true, message: "键不能为空", trigger: "blur" },
    ],
    value: [
        { required: true, message: "值不能为空", trigger: "blur" },
    ]
});

const dictRules = ref({
    name: [
        { required: true, message: "字典数据名称不能为空", trigger: "blur" },
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

//字典查询
const dict = ref({
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//字典数据查询
const dictChildren = ref({
    dict: {
        id: ""
    },
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//字典表单
const dictForm = ref({
    id: "",
    name: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

//字典数据表单
const dictChildrenForm = ref({
    id: "",
    dict: {
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
    // dictAPI.list(dict.value).then((res) => {
    //     store.setDict(buildTree(res.data.dictTree));
    //     treeData.value = store.dict;
    //     dictLoading.value = false;
    //     dictChildrenLoading.value = false
    // })
    if (store.dict == undefined || isNeedUpdate()) {
        getDicts().then(() => {
            treeData.value = store.dict;
            dictLoading.value = false;
            dictChildrenLoading.value = false
        })
    } else {
        treeData.value = store.dict;
        dictLoading.value = false;
        dictChildrenLoading.value = false
    }
});

//处理字典数据树节点点击
const handleNodeClick = (data) => {
    addDictButtonDisabled.value = false
    store.dict.map((item) => {
        if (item.value == data.value) {
            tableData.value = item.dictChildren;
            dictChildrenForm.value.dict.id = item.value
            refreshTableButtonDisabled.value = false
        }
    })
    if (tableData.value == null) {
        refreshTableButtonDisabled.value = true
    }

};
//字典树筛选
const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
//字典树筛选文本监听
watch(filterText, (value) => {
    treeRef.value.filter(value)
})
//处理字典树节点选中
const handleCheckChange = (data) => {
    const node = treeRef.value.getCheckedNodes(false, false)
    treeChecked.value = node
    dictIDs.value = treeChecked.value.map((item) => item.value).join(",");
    deleteDictChildrenButtonDisabled.value = (treeChecked.value.length == 0);
}

//表单重置
const resetForm = () => {
    dictForm.value = {
        id: "",
        name: "",
        page: {
            pageNo: 1,
            pageSize: 20,
            orderBy: ""
        }
    }
    dictChildrenForm.value = {
        id: "",
        dict: {
            id: dictChildrenForm.value.dict.id
        },
        label: "",
        value: "",
        version: "",
    }
}

//新增字典
const addDict = () => {
    resetForm()
    dictDialogVisible.value = true;
    dialogTitle.value = "新建字典";
}
//编辑字典
const editDict = (row) => {
    dictForm.value.id = row.id;
    dictForm.value.name = row.name;
    dictForm.value.version = row.version;
    dictDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "字典";
}
//删除字典
const deleteDict = (node, data) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (node.data && node.data.value != undefined) {
            dictIDs.value = node.data.value;
            treeChecked.value.push(node);
        }
        if (dictIDs.value == "") {
            return
        }
        dictAPI.delete(dictIDs.value).then((res) => {
            treeChecked.value.forEach(item => {
                treeRef.value.remove(item);
            });
            ElMessage.success("删除成功");
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

//新增字典数据
const addDictChildren = () => {
    resetForm()
    dictChildrenDialogVisible.value = true;
    dialogTitle.value = "新建字典数据";
}
//编辑字典数据
const editDictChildren = (row) => {
    dictChildrenForm.value.id = row.id;
    dictChildrenForm.value.dict.id = row.dict.id;
    dictChildrenForm.value.label = row.label;
    dictChildrenForm.value.value = row.value;
    dictChildrenForm.value.version = row.version;
    dictChildrenDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "字典数据";
}
//删除字典数据
const deleteDictChildren = (row) => {
    ElMessageBox.confirm("确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (row.id != undefined) {
            dictChildrenIDs.value = row.id;
        }
        if (dictChildrenIDs.value == "") {
            return
        }
        dictChildrenAPI.delete(dictChildrenIDs.value).then((res) => {
            ElMessage.success("删除成功");
            getDictChildrenList(row.dict.id);
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
    if (type == "dict") {
        dictFormRef.value.validate((valid) => {
            if (valid) {
                dictAPI.save(dictForm.value).then((res) => {
                    if (dialogTitle.value == "编辑字典") {
                        ElMessage.success("更新字典成功");
                    } else if (dialogTitle.value == "新建字典") {
                        ElMessage.success("新建字典成功");
                    }
                    dictDialogVisible.value = false;
                    getDictList();
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    } else if (type == "dictChildren") {
        dictChildrenFormRef.value.validate((valid) => {
            if (valid) {
                dictChildrenAPI.save(dictChildrenForm.value).then((res) => {
                    if (dialogTitle.value == "编辑字典数据") {
                        ElMessage.success("更新字典数据成功");
                    } else if (dialogTitle.value == "新建字典数据") {
                        ElMessage.success("新建字典数据成功");
                    }
                    dictChildrenDialogVisible.value = false;
                    getDictChildrenList(dictChildrenForm.value.dict.id);
                }).catch((error) => {
                    console.log(error);
                })
            }
        })
    }
    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}

//获取字典列表
const getDictList = () => {
    dictLoading.value = true;
    dictAPI.list(dict.value).then((res) => {
        treeData.value = buildTree(res.data.dictTree);
        dictLoading.value = false;
    });
};

//获取字典数据列表
const getDictChildrenList = (dictID) => {
    dictChildrenLoading.value = true;
    dictAPI.list(dict.value).then((res) => {
        treeData.value = buildTree(res.data.dictTree);
        store.setDict(buildTree(res.data.dictTree));
        dictChildrenLoading.value = false;
        treeData.value.forEach((item) => {
            if (item.value == dictID) {
                tableData.value = item.dictChildren;
            }
        })
        nextTick(() => {
            treeRef.value.setCurrentKey(dictID)
        })
    });
};

//刷新表格
const refreshTable = () => {
    dictChildren.value.page.pageNo = 1;
    pageNo.value = 1;
    getDictChildrenList();
};

//处理每页大小变化
const handleSizeChange = (value) => {
    dict.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        dict.value.page.pageNo = pageNo.value;
    }
    getDictList();
};
//处理页码改变
const handleCurrentChange = (value) => {
    dict.value.page.pageNo = value;
    getDictList();
};

//处理多选改变
const handleSelectionChange = (value) => {
    deleteDictButtonDisabled.value = value.length == 0;
    dictChildrenIDs.value = value.map((item) => item.id).join(",");
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
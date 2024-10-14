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
                :expand-on-click-node="false" />
        </el-aside>
        <el-main class="main">
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addDict" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteDictButtonDisabled" @click="deleteDict"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <el-button-group>
                    <el-button type="default" @click="refreshTable">刷新</el-button>
                </el-button-group>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="dictChildrenLoading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange" row-key="id">
                <el-table-column type="selection" header-align="center" align="center" />
                <el-table-column prop="id" label="id" width="80" align="center" v-if="false" />
                <el-table-column prop="label" label="字典键" align="center" width="150" />
                <el-table-column prop="value" label="字典值" align="center" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editDict(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteDict(scope.row)"
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
        <el-form :model="dictForm">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="字典名" prop="username">
                        <el-input v-model="dictForm.username" placeholder="请填写字典名"
                            :disabled="usernameDisabled || roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="dictForm.name" placeholder="请填写姓名" :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="工号" prop="no">
                        <el-input v-model="dictForm.no" placeholder="请填写工号" :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="字典数据" prop="dictChildren">
                        <el-tree-select v-model="dictForm.dictChildren.id" :data="store.departmentList"
                            :render-after-expand="false" filterable :disabled="roleLevelBoolean" />
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="userDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('dict')" :loading="submitButtonLoading"
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
                        <el-button type="primary" @click="addDictChildren()" v-if="!roleLevelBoolean">新增</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="danger" plain :disabled="deleteDictChildrenButtonDisabled"
                            v-if="!roleLevelBoolean" @click="deleteDictChildren(departmentIDs)">删除</el-button>
                    </el-col>
                </el-row>
                <el-tree ref="treeRef" :data="treeData" highlight-current :filter-node-method="filterNode" show-checkbox
                    @check-change="handleCheckChange" v-loading="dictLoading" check-strictly node-key="value"
                    default-expand-all>
                    <template #default="{ node, data }">
                        <span class="tree-node">
                            <span>{{ node.label }}</span>
                            <span>
                                <el-button class="blue-text-button" link @click="editDictChildren(data, $event);
                                $event.stopPropagation()">{{ editButtonText }}</el-button>
                                <el-button class="blue-text-button" link @click="deleteDictChildren(node, data, $event);
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
        <el-form :model="dictChildrenForm">
            <el-row :gutter="15">
                <el-col :span="12">
                    <el-form-item label="字典数据名称" prop="name">
                        <el-input v-model="dictChildrenForm.name" placeholder="请填写字典数据名称"
                            :disabled="roleLevelBoolean"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="父字典数据" prop="parent">
                        <el-tree-select v-model="dictChildrenForm.parent.id" :data="store.departmentList"
                            :render-after-expand="false" filterable :disabled="roleLevelBoolean" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="departmentDialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit('dictChildren')" :loading="submitButtonLoading"
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

import dictAPI from "@/api/Dict";
import dictChildrenAPI from "@/api/DictChildren";
import { buildTree } from "@/utils/BuildTree";
import { ElMessage, ElMessageBox } from "element-plus";
import { id } from "element-plus/es/locales.mjs";

const treeRef = ref(null);
const treeData = ref([]);
const filterText = ref("");
const tableData = ref([]);

//加载状态
const dictChildrenLoading = ref(true);
const dictLoading = ref(true);
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
const deleteDictButtonDisabled = ref(true);
const deleteDictChildrenButtonDisabled = ref(true);

//字典数据树相关
const treeChecked = ref([])

//字典和字典数据被多选选中的id
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

//字典查询
const dict = ref({
    name: "",
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
    dict: dict.value,
    role: {}
});

//字典数据表单
const dictChildrenForm = ref({
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
    dictAPI.list(dict.value).then((res) => {
        store.setDict(buildTree(res.data.page.list));
        treeData.value = store.dict;
        dictLoading.value = false;
        dictChildrenLoading.value = false
    })
    // Promise.all([
    //     dictChildrenAPI.list(dictChildren.value).then((res) => {
    //         res.data.page.list.count = res.data.page.count;
    //         store.setDictChildren(res.data.page.list);
    //         dictChildrenLoading.value = false;
    //     }),

    // ]).then(() => {
    //     total.value = store.dictChildren.count;
    //     tableData.value = store.dictChildren;
    // });

});

//处理字典数据树节点点击
const handleNodeClick = (data) => {
    dictChildren.value.dict.id = data.value
    getDictChildrenList();
};
//字典数据树筛选
const filterNode = (value, data) => {
    if (!value) return true
    return data.label.includes(value)
}
//字典数据树筛选文本监听
watch(filterText, (value) => {
    treeRef.value.filter(value)
})
//处理字典数据树节点选中
const handleCheckChange = (data) => {
    if (data.children.length > 0 && node) {
        ElMessage.warning("无法删除当前包含子节点的字典数据，请先删除子字典数据");
        return
    }
    const node = treeRef.value.getCheckedNodes(false, false)
    treeChecked.value = node
    departmentIDs.value = treeChecked.value.map((item) => item.value).join(",");
    deleteDictChildrenButtonDisabled.value = (treeChecked.value.length == 0);
}

//表单重置
const resetForm = () => {
    dictForm.value = {
        id: "",
        username: "",
        name: "",
        no: "",
        dictChildren: {
            id: "",
        },
        role: "",
        version: "",
    }
    dictChildrenForm.value = {
        id: "",
        name: "",
        parent: {
            id: "",
        },
        version: "",
    }
}

//新增字典
const addDict = () => {
    resetForm()
    userDialogVisible.value = true;
    dialogTitle.value = "新建字典";
    usernameDisabled.value = false;
}
//编辑字典
const editDict = (row) => {
    dictForm.value.id = row.id;
    dictForm.value.username = row.username;
    dictForm.value.name = row.name;
    dictForm.value.no = row.no;
    dictForm.value.dictChildren = row.dictChildren;
    dictForm.value.version = row.version;
    userDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "字典";
}
//删除字典
const deleteDict = (row) => {
    ElMessageBox.confirm("确定删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        if (store.dict.id == row.id) {
            ElMessage.error("无法删除该账号");
            return
        }
        if (row.id != undefined) {
            userIDs.value = row.id;
        }
        if (userIDs.value == "") {
            return
        }
        dictAPI.delete(userIDs.value).then((res) => {
            ElMessage.success("删除成功");
            getDictList();
        }).catch(() => {
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

//新增字典数据
const addDictChildren = () => {
    resetForm()
    departmentDialogVisible.value = true;
    dialogTitle.value = "新建字典数据";
}
//编辑字典数据
const editDictChildren = (row) => {
    dictChildrenForm.value.id = row.value;
    dictChildrenForm.value.name = row.label;
    dictChildrenForm.value.parent.id = row.parent;
    dictChildrenForm.value.version = row.version;
    departmentDialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "字典数据";
}
//删除字典数据
const deleteDictChildren = (node, data) => {
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
        dictChildrenAPI.delete(departmentIDs.value).then((res) => {
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
    if (type == "dict") {
        dictAPI.save(dictForm.value).then((res) => {
            if (dialogTitle.value == "编辑字典") {
                ElMessage.success("更新字典成功");
            } else if (dialogTitle.value == "新建字典") {
                ElMessage.success("新建字典成功");
            }
            userDialogVisible.value = false;
            getDictList();
        }).catch((error) => {
            console.log(error);
        })
    } else if (type == "dictChildren") {
        console.log(dictChildrenForm.value);
        dictChildrenAPI.save(dictChildrenForm.value).then((res) => {
            if (dialogTitle.value == "编辑字典数据") {
                ElMessage.success("更新字典数据成功");
            } else if (dialogTitle.value == "新建字典数据") {
                ElMessage.success("新建字典数据成功");
            }
            departmentDialogVisible.value = false;
            getDictChildrenList();
        }).catch((error) => {
            console.log(error);
        })
    }
    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}

//获取字典列表
const getDictList = () => {
    dictLoading.value = true;
    dictChildrenAPI.list(dictChildren.value).then((res) => {
        treeData.value = buildTree(res.data.page.list);
        dictLoading.value = false;
    });
};

//获取字典数据列表
const getDictChildrenList = () => {
    dictChildrenLoading.value = true;
    dictChildrenAPI.list(dictChildren.value).then((res) => {
        tableData.value = res.data.page.list
        total.value = res.data.page.count;
        dictChildrenLoading.value = false;
    });
};

//刷新表格
const refreshTable = () => {
    dict.value.page.pageNo = 1;
    pageNo.value = 1;
    getDictList();
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
        dict.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        dict.value.page.orderBy = ""
    }
    getDictList();
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
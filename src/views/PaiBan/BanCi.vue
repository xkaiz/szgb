<template>

    <el-container class="container">
        <el-main class="main">
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addSchedule" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteButtonDisabled" @click="deleteSchedule"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <div>
                    <el-button type="default" @click="refreshScheduleTable">刷新</el-button>
                </div>
            </el-row>
            <el-table class="table" :data="tableData" stripe v-loading="scheduleLoading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column fixed="left" type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="id" label="id" width="80" v-if="false" />
                <el-table-column prop="department.name" label="排班部门" show-overflow-tooltip sortable="custom"
                    width="200" />
                <el-table-column prop="date" label="日期" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="m800" label="800M" show-overflow-tooltip sortable="custom" width="200" />
                <el-table-column prop="dayGaffer" label="白班领班" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="dayLeader" label="白班抢修组长" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="dayContact" label="白班信息联络" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="dayMateriel" label="白班物料准备" show-overflow-tooltip sortable="custom"
                    width="150" />
                <el-table-column prop="dayOther" label="白班其它人员" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="nightGaffer" label="夜班领班" show-overflow-tooltip sortable="custom" width="150" />
                <el-table-column prop="nightLeader" label="夜班抢修组长" show-overflow-tooltip sortable="custom"
                    width="150" />
                <el-table-column prop="nightContact" label="夜班信息联络" show-overflow-tooltip sortable="custom"
                    width="150" />
                <el-table-column prop="nightMateriel" label="夜班物料准备" show-overflow-tooltip sortable="custom"
                    width="150" />
                <el-table-column prop="nightOther" label="夜班其它人员" show-overflow-tooltip sortable="custom" width="150" />

                <el-table-column fixed="right" label="操作" width="150">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editSchedule(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteSchedule(scope.row)"
                            v-if="!roleLevelBoolean">删除</el-button>
                        <el-button link type="primary" size="small" @click="exportSchedule(scope.row)">导出</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="70%" draggable overflow :close-on-click-modal="false"
        v-if="dialogVisible">
        <el-form :model="scheduleForm" ref="scheduleFormRef">
            <el-row :gutter="15">
                <el-col :span="6">
                    <el-form-item label="排班部门" prop="department.id" required>
                        <DepartmentSelect ref="departmentSelectRef" @model="setModel" :id="scheduleForm.department.id"
                            :disabled="roleLevelBoolean" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="日期" prop="date">
                        <el-date-picker v-model="scheduleForm.date" placeholder="请选择日期" required></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="800M 1" prop="m800">
                        <el-input v-model="scheduleForm.m800Array[0]" placeholder="请输入800M"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="800M 2" prop="m800">
                        <el-input v-model="scheduleForm.m800Array[1]" placeholder="请输入800M"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="800M 3" prop="m800">
                        <el-input v-model="scheduleForm.m800Array[2]" placeholder="请输入800M"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <span class="edit-subtitle">白班应急分工</span>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="领班" prop="dayGaffer">
                        <el-select v-model="scheduleForm.dayGaffer" :disabled="dayOptions.length == 0">
                            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="15">
                <el-col :span="6">
                    <el-form-item label="抢修组长" prop="dayLeader">
                        <el-select>
                            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="信息联络" prop="dayContact">
                        <el-select>
                            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="物料准备" prop="dayMateriel">
                        <el-select>
                            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="其它人员" prop="dayOther">
                        <el-select>
                            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <span class="edit-subtitle">夜班应急分工</span>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="领班" prop="nightGaffer">
                        <el-select>
                            <el-option v-for="item in nightOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="15">
                <el-col :span="6">
                    <el-form-item label="抢修组长" prop="nightLeader">
                        <el-select>
                            <el-option v-for="item in nightOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="信息联络" prop="nightContact">
                        <el-select>
                            <el-option v-for="item in nightOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="物料准备" prop="nightMateriel">
                        <el-select>
                            <el-option v-for="item in nightOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="其它人员" prop="nightOther">
                        <el-select>
                            <el-option v-for="item in nightOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row class="toolbar">
                <div>
                    <el-button type="primary" @click="addSchedulePlan" v-if="!roleLevelBoolean">新增</el-button>
                    <el-button type="danger" plain :disabled="deleteButtonDisabled" @click="deleteSchedulePlan"
                        v-if="!roleLevelBoolean">删除</el-button>
                </div>
                <div>
                    <el-button type="success">自动排班</el-button>
                    <el-button type="default" @click="refreshSchedulePlanTable">刷新</el-button>
                </div>
            </el-row>
            <el-table :data="subTableData" stripe v-loading="schedulePlanLoading"
                @selection-change="handleSelectionChange" @sort-change="handleSortChange">
                <el-table-column type="selection" header-align="center" align="center" width="50" />
                <el-table-column prop="id" label="id" width="80" v-if="false" />
                <el-table-column prop="leaderName" label="负责人" show-overflow-tooltip width="120" fixed="left" />
                <el-table-column prop="memberNames" label="参与人员" show-overflow-tooltip width="300" fixed="left" />
                <el-table-column prop="taskType" label="任务类型" show-overflow-tooltip width="100" />
                <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip width="120" />
                <el-table-column prop="location" label="任务地点" show-overflow-tooltip width="120" />
                <el-table-column prop="scheduleType" label="班次类型" show-overflow-tooltip width="100" />
                <el-table-column prop="startAt" label="开始时间" show-overflow-tooltip width="180" />
                <el-table-column prop="endAt" label="结束时间" show-overflow-tooltip width="180" />

                <el-table-column prop="goal" label="目标" show-overflow-tooltip width="200" />
                <el-table-column prop="remark" label="备注" show-overflow-tooltip width="200" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="editSchedulePlan(scope.row)">
                            {{ editButtonText }}
                        </el-button>
                        <el-button link type="primary" size="small" @click="deleteSchedulePlan(scope.row)"
                            v-if="!roleLevelBoolean">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false" v-if="!roleLevelBoolean">取消</el-button>
            <el-button type="primary" @click="submit(1)" :loading="submitButtonLoading" v-if="!roleLevelBoolean">
                {{ submitButtonText }}
            </el-button>
        </template>
    </el-dialog>

    <div class="drawer">
        <el-drawer v-model="drawerVisible" direction="ltr" size="30%" :close-on-click-modal="false"
            v-if="drawerVisible">
            <template #header>
                <h3>{{ drawerTitle }}</h3>
            </template>
            <el-form :model="schedulePlanForm" label-width="80">
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="任务类型" prop="taskType">
                            <DictSelect @model="setModel" :form="schedulePlanForm" dict="任务类型/taskType"></DictSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务名称" prop="taskName">
                            <el-select v-model="schedulePlanForm.taskName" filterable allow-create default-first-option
                                :disabled="roleLevelBoolean">
                                <template #footer>
                                    <el-button v-if="!isTemplateAdding" text bg size="small"
                                        @click="onAddTemplateOption">
                                        添加模板
                                    </el-button>
                                    <template v-else>
                                        <div style="width: 100%;">
                                            <el-input v-model="templateOption" class="template-input"
                                                placeholder="输入模板内容" type="textarea" size="small" autosize />
                                        </div>

                                        <el-button type="primary" size="small" @click="onTemplateConfirm(5)">
                                            添加
                                        </el-button>
                                        <el-button size="small" @click="isTemplateAdding = false">取消</el-button>

                                    </template>
                                </template>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="任务地点" prop="location">
                            <el-select v-model="schedulePlanForm.location" filterable allow-create default-first-option
                                :disabled="roleLevelBoolean">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="班次类型" prop="scheduleType" filterable default-first-option>
                            <DictSelect @model="setModel" :form="schedulePlanForm" dict="班次类型/scheduleType">
                            </DictSelect>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15" v-if="schedulePlanForm.scheduleType == '间接'">
                    <el-col :span="12">
                        <el-form-item label="开始时间" prop="startAt">
                            <DictSelect @model="setModel" :form="schedulePlanForm" dict="工作时间/startAt"></DictSelect>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="15" v-if="schedulePlanForm.scheduleType == '间接'">
                    <el-col :span="12">
                        <el-form-item label="结束时间" prop="endAt">
                            <DictSelect @model="setModel" :form="schedulePlanForm" dict="工作时间/endAt"></DictSelect>
                        </el-form-item>
                    </el-col>
                    <el-form-item label="次日" prop="nextDay">
                        <el-switch v-model="nextDay" />
                    </el-form-item>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="leader">
                            <UserSelect @model="setModel" user-type="leader" :form="schedulePlanForm">
                            </UserSelect>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="参与人员" prop="member">
                            <UserSelect @model="setModel" :multiple="true" :collapse-tags="true"
                                :collapse-tags-tooltip="true" :max-collapse-tags="4" user-type="member"
                                :form="schedulePlanForm" style="width: 100%;">
                            </UserSelect>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="目标" prop="goal">
                            <el-input v-model="schedulePlanForm.goal" style="width: 100%" rows="5" type="textarea" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="15">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="schedulePlanForm.remark" style="width: 100%" rows="5" type="textarea" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button @click="drawerVisible = false" v-if="!roleLevelBoolean">取消</el-button>
                <el-button type="primary" @click="submit(2)" :loading="submitButtonLoading" v-if="!roleLevelBoolean">
                    {{ submitButtonText }}
                </el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import scheduleAPI from "@/api/Schedule";
import schedulePlanAPI from "@/api/SchedulePlan";
import exportAPI from "@/api/Export";
import dictChildrenAPI from "@/api/DictChildren";

import { ElMessage, ElMessageBox } from "element-plus";
import DictSelect from "@/components/DictSelect.vue";
import DepartmentSelect from "@/components/DepartmentSelect.vue"
import UserSelect from "@/components/UserSelect.vue";
import { formatDate } from "@/utils/Format";
import { getDicts } from "@/utils/Dict";

const userSelectRef = ref(null);
const departmentSelectRef = ref(null);

const tableData = ref([]);
const subTableData = ref([]);
const scheduleLoading = ref(true);
const schedulePlanLoading = ref(true);
const pageNo = ref(1);
const pageSize = ref(20);
const total = ref(0);

const dialogVisible = ref(false);
const dialogTitle = ref("");
const drawerTitle = ref("");

const drawerVisible = ref(false);

const submitButtonLoading = ref(false);
const submitButtonText = ref("提交");

const deleteButtonDisabled = ref(true);

const IDs = ref("");

const scheduleFormRef = ref(null);

const isTemplateAdding = ref(false);
const templateOption = ref("");
const onAddTemplateOption = () => {
    isTemplateAdding.value = true;
}

const onTemplateConfirm = (id) => {

}

const setModel = (data) => {
    console.log("子组件传递的数据：", data);
    if (data.type == "department") {
        scheduleForm.value[data.type].id = data.value;
    } else if (data.type == "user") {
        if (drawerTitle.value == "新建计划") {

        } else if (drawerTitle.value == "编辑计划") {
            if (data.userType == "0") {
                schedulePlanForm.value.leaderId = data.value
            } else if (data.userType == "1") {
                schedulePlanForm.value.memberIds = data.value
            }
        }
    } else {
        schedulePlanForm.value[data.type] = data.value;
    }
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

const scheduleColumns = [
    {
        id: 1,
        label: "常白班",
        value: "8:30-17:30",
    },
    {
        id: 2,
        label: "大白班",
        value: "8:30-20:30",
    },
    {
        id: 3,
        label: "夜班",
        value: "20:30-06:30"
    }
];

const initialScheduleForm = {
    id: "",
    department: {
        id: "",
        name: "",
    },
    date: "",
    m800: "",
    m800Array: ["", "", ""],
    dayGaffer: "",
    dayLeader: "",
    dayContact: "",
    dayMateriel: "",
    dayOther: "",
    nightGaffer: "",
    nightLeader: "",
    nightContact: "",
    nightMateriel: "",
    nightOther: "",
    version: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
};

const initialSchedulePlanForm = {
    id: "",
    schedule: {
        id: "",
    },
    schedulePeopleList: [],
    leader: "",
    leaderName: "",
    leaderId: "",
    member: [],
    memberNames: "",
    memberIds: [],
    taskType: "",
    taskName: "",
    location: "",
    scheduleType: "",
    startAt: "",
    endAt: "",
    goal: "",
    remark: "",
    version: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
};

const scheduleForm = ref({ ...initialScheduleForm });
const schedulePlanForm = ref({ ...initialSchedulePlanForm });


const nextDay = ref(false)

const dayOptions = ref([])
const nightOptions = ref([])

const taskType = ref([])
const scheduleType = ref([])

onMounted(() => {
    const token = cookies.get("token");
    if (token == null || token == "") {
        window.location.href = "/login?path=JiHua";
        return
    }
    initDictSelectOptions()
    getScheduleList();
});

const resetScheduleForm = () => {
    scheduleForm.value = { ...initialScheduleForm };
}

const resetSchedulePlanForm = () => {
    schedulePlanForm.value = { ...initialSchedulePlanForm };
}


const exportSchedule = (row) => {
    scheduleForm.value = row;
    scheduleForm.value.date = formatDate(scheduleForm.value.date, 0)
    exportAPI.exportSchedule(row).then((res) => {
        console.log(res);
        ElMessage.success("导出成功");
    })
}

const addSchedule = () => {
    resetScheduleForm()
    subTableData.value = []
    scheduleForm.value.department.id = store.user.department.id
    schedulePlanLoading.value = false
    dialogVisible.value = true;
    dialogTitle.value = "新建班次";
}

const editSchedule = (row) => {
    scheduleForm.value = row;
    scheduleForm.value.m800Array = row.m800.split(",")
    getSchedulePlanList(row.id)
    dialogVisible.value = true;
    dialogTitle.value = editButtonText.value + "班次";
}

const deleteSchedule = (row) => {
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
        scheduleAPI.delete(IDs.value).then((res) => {
            ElMessage.success("删除成功");
            getScheduleList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const addSchedulePlan = () => {
    drawerTitle.value = "新建计划";
    resetSchedulePlanForm()
    schedulePlanForm.value.schedule.id = scheduleForm.value.id
    drawerVisible.value = true;
}

const editSchedulePlan = (row) => {
    drawerTitle.value = "编辑计划";
    row.schedulePeopleList = [];
    schedulePlanForm.value = JSON.parse(JSON.stringify(row));
    schedulePlanForm.value.schedulePeopleList = []
    drawerVisible.value = true;
}

const deleteSchedulePlan = (row) => {
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
        schedulePlanAPI.delete(IDs.value).then((res) => {
            ElMessage.success("删除成功");
            getSchedulePlanList(scheduleForm.value.id);
        }).catch((error) => {
            console.log(error);
            ElMessage.error("删除失败");
        });
    }).catch(() => { })
}

const initDictSelectOptions = () => {
    taskType.value = store.dict.find(item => item.label == "任务类型").dictChildren
    scheduleType.value = store.dict.find(item => item.label == "班次类型").dictChildren
}

/**
 * 提交表单
 * @param {*} type 1:提交班次 2：提交计划 
 */
const submit = (type) => {
    submitButtonLoading.value = true;
    submitButtonText.value = "提交中";
    if (type == 1) {
        scheduleForm.value.date = formatDate(scheduleForm.value.date, 0)
        scheduleForm.value.m800 = scheduleForm.value.m800Array.join(",")
        scheduleAPI.save(scheduleForm.value).then((res) => {
            ElMessage.success("提交成功");
            dialogVisible.value = false;
            getScheduleList();
        }).catch((error) => {
            console.log(error);
            ElMessage.error("提交失败");
        });
    } else if (type == 2) {
        if (drawerTitle.value == "编辑计划") {
            schedulePlanForm.value.schedulePeopleList.push({
                "user": {
                    "id": schedulePlanForm.value.leaderId,
                },
                type: 0
            });
            schedulePlanForm.value.memberIds.forEach((item) => {
                schedulePlanForm.value.schedulePeopleList.push({
                    "user": {
                        "id": item,
                    },
                    type: 1
                })
            });
            schedulePlanForm.value.taskType = Number(taskType.value.find(item => item.label == schedulePlanForm.value.taskType).value);
            schedulePlanForm.value.scheduleType = Number(scheduleType.value.find(item => item.label == schedulePlanForm.value.scheduleType).value);
            const nextDate = new Date(scheduleForm.value.date);
            if (schedulePlanForm.value.startAt.split(' ').length == 1 && schedulePlanForm.value.endAt.split(' ').length == 1) {
                if (schedulePlanForm.value.scheduleType != "间接") {
                    const range = scheduleColumns.find(column => column.label == schedulePlanForm.value.scheduleType || column.id == schedulePlanForm.value.scheduleType).value.split('-');
                    schedulePlanForm.value.startAt = scheduleForm.value.date + " " + range[0] + ":00";
                    nextDate.setDate(nextDate.getDate() + (schedulePlanForm.value.scheduleType == 3 ? 1 : 0));
                    schedulePlanForm.value.endAt = formatDate(nextDate) + " " + range[1] + ":00";
                } else if (schedulePlanForm.value.scheduleType == "间接" && schedulePlanForm.value.startAt != "" && schedulePlanForm.value.endAt != "") {
                    schedulePlanForm.value.startAt = scheduleForm.value.date + " " + schedulePlanForm.value.startAt + ":00";
                    nextDate.setDate(nextDate.getDate() + (nextDay.value ? 1 : 0));
                    schedulePlanForm.value.endAt = formatDate(nextDate) + " " + schedulePlanForm.value.endAt + ":00";
                }
            }
        }
        schedulePlanAPI.save(schedulePlanForm.value).then((res) => {
            ElMessage.success("提交成功");
            drawerVisible.value = false;
            getSchedulePlanList(schedulePlanForm.value.schedule.id);
        }).catch((error) => {
            console.log(error);
            ElMessage.error("提交失败");
        });
    }

    submitButtonLoading.value = false;
    submitButtonText.value = "提交";
}
const getScheduleList = () => {
    resetScheduleForm();
    scheduleLoading.value = true;
    scheduleAPI.list(scheduleForm.value).then((res) => {
        res.data.page.list.forEach((item) => {
            item.date = formatDate(item.date)
        });
        store.setSchedule(res.data.page.list);
        total.value = res.data.page.count;
        tableData.value = res.data.page.list;
        scheduleLoading.value = false;
    });
};

const getSchedulePlanList = (scheduleID) => {
    schedulePlanLoading.value = true;
    resetSchedulePlanForm()
    schedulePlanForm.value.schedule.id = scheduleID;
    schedulePlanAPI.list(schedulePlanForm.value).then((res) => {
        res.data.page.list.forEach((item) => {
            item.taskType = taskType.value.find(item1 => item1.value == item.taskType).label;
            item.scheduleType = scheduleType.value.find(item1 => item1.value == item.scheduleType).label;
        });
        store.setSchedulePlan(res.data.page.list);
        subTableData.value = res.data.page.list;
        subTableData.value.forEach(element => {
            element.leader = element.schedulePeopleList.find(item => item.type == "0");
            element.leaderName = element.schedulePeopleList.find(item => item.type == "0").user.name;
            element.leaderId = element.schedulePeopleList.find(item => item.type == "0").user.id;
            element.member = element.schedulePeopleList.filter(item => item.type == "1");
            element.memberNames = element.member.map(item => item.user.name).join("、");
            element.memberIds = element.member.map(item => item.user.id)
            element.startAt = formatDate(element.startAt, 1);
            element.endAt = formatDate(element.endAt, 1);
        });
        schedulePlanLoading.value = false;
    });
}

// const formatDate = (date, type) => {
//     date = new Date(date);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     let time = ""
//     if (type == 0) {
//         time = " 00:00:00"
//     } else if (type == 1) {
//         time = " " + hours + ":" + minutes + ":00"
//     }
//     return `${year}-${month}-${day}${time}`;
// };


const refreshScheduleTable = () => {
    console.log(scheduleForm.value);
    scheduleForm.value.page.pageNo = 1;
    pageNo.value = 1;
    getScheduleList();
};

const refreshSchedulePlanTable = () => {
    schedulePlanForm.value.page.pageNo = 1;
    pageNo.value = 1;
    getSchedulePlanList(scheduleForm.value.id);
};

const handleSizeChange = (value) => {
    user.value.page.pageSize = value;
    if (pageNo.value * value > total.value) {
        pageNo.value = Math.ceil(total.value / value);
        user.value.page.pageNo = pageNo.value;
    }
    getScheduleList();
};

const handleCurrentChange = (value) => {
    user.value.page.pageNo = value;
    getScheduleList();
};

const handleSelectionChange = (value) => {
    deleteButtonDisabled.value = value.length == 0;
    IDs.value = value.map((item) => item.id).join(",");
}

const handleSortChange = (column, prop, order) => {
    if (column.order != null) {
        column.order = column.order.replace(/ending/, "");
        user.value.page.orderBy = `${column.prop} ${column.order}`;
    } else {
        user.value.page.orderBy = ""
    }
    getScheduleList();
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

.edit-subtitle {
    font-size: medium;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2%;
    text-decoration: underline;
}

.drawer:deep(.el-drawer__header) {
    margin-bottom: 0
}

.template-input {
    margin-bottom: 0.5rem;
}
</style>
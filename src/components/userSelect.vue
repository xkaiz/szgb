<template>
    <el-select v-model="userSelect" filterable remote remote-show-suffix clearable :multiple="props.multiple"
        :collapse-tags="props.collapseTags" :collapse-tags-tooltip="props.collapseTagsTooltip"
        :remote-method="remoteMethod" :loading="loading" @change="handelChange" @click="getList">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref, version } from 'vue'
import userAPI from '@/api/user'

const props = defineProps(["id", "form", "userType", "multiple", "collapseTags", "collapseTagsTooltip"])
const emit = defineEmits(["model"]);

const userSelect = ref(null)
const userSelectId = ref(null)
const loading = ref(true);

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

onMounted(() => {
    if (props.form != undefined && props.form.id != "") {
        if (props.userType == 'leader') {
            userSelect.value = props.form.leader.user.name;
            userSelectId.value = props.form.leader.user.id;
        } else if (props.userType == 'member') {
            userSelect.value = []
            userSelectId.value = []
            props.form.member.forEach(element => {
                userSelect.value.push(element.user.name);
                userSelectId.value.push(element.user.id);
            });
        }

    }
    getList();
});

const remoteMethod = (query) => {
    user.value.name = query;
    getList();
};
const options = ref([]);
const getList = () => {
    loading.value = true;
    userAPI.list(user.value).then((res) => {
        userSelect.value = userSelectId.value
        options.value = res.data.page.list;
        loading.value = false;
        if (props.id != undefined) {
            userSelect.value = props.id;
        }
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (data) => {
    // let tempData = JSON.parse(JSON.stringify(data));
    // props.form.member.forEach((element, index) => {
    //     for (let i = 0; i < tempData.length; i++) {
    //         if (element.user.name == tempData[i]) {
    //             tempData[i] = element.user.id;
    //             break;
    //         }
    //     }
    // });
    // data = tempData;
    userSelectId.value = data;
    emit("model", { type: "user", value: data, userType: props.userType == 'leader' ? 0 : 1, id: props.form.id, version: props.form.version });
};

const clear = () => {
    userSelect.value = null;
};
defineExpose({
    clear
})
</script>
<template>
    <el-select v-model="userSelect.id" filterable remote remote-show-suffix clearable :multiple="props.multiple"
        :collapse-tags="props.collapseTags" :collapse-tags-tooltip="props.collapseTagsTooltip"
        :remote-method="remoteMethod" :loading="loading" @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import userAPI from '@/api/user'

const props = defineProps(["id", "userType", "multiple", "collapseTags", "collapseTagsTooltip"])
const emit = defineEmits(["model"]);

const userSelect = ref({
    id: "",
})
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
    if (props.id != undefined) {
        userSelect.value.id = props.id;
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
        options.value = res.data.page.list;
        loading.value = false;
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (data) => {

    emit("model", { type: "user", value: data, userType: props.userType == 'leader' ? 0 : 1 });
};

const clear = () => {
    userSelect.value.id = "";
};
defineExpose({
    clear
})
</script>
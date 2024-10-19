<template>
    <el-select v-model="userSelect.id" filterable remote placeholder="请选择用户" :remote-method="remoteMethod"
        :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import userAPI from '@/api/user'

const props = defineProps(["id"])
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

const handelChange = (value) => {
    emit("model", { type: "user", id: value });
};

const clear = () => {
    userSelect.value.id = "";
};
defineExpose({
    clear
})
</script>
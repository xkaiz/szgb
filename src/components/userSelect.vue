<template>
    <el-select v-model="userSelect.id" filterable remote reserve-keyword placeholder="请选择用户"
        :remote-method="remoteMethod" :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
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
    getUserList();
});

const remoteMethod = (query) => {
    user.value.name = query;
    getUserList();
};
const options = ref([]);
const getUserList = () => {
    loading.value = true;
    userAPI.getUserList(user.value).then((res) => {
        options.value = res.data.page.list;
        userSelect.value.id = props.id;
        loading.value = false;
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (value) => {
    emit("model", value);
};

</script>
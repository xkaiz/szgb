<template>
    <el-select v-model="roleSelect.id" filterable remote placeholder="请选择角色" :remote-method="remoteMethod"
        :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import roleAPI from '@/api/Role'

const props = defineProps(["id"])
const emit = defineEmits(["model"]);

const roleSelect = ref({
    id: "",
})
const loading = ref(true);

const role = ref({
    name: "",
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

onMounted(() => {
    if (props.id != undefined) {
        roleSelect.value.id = props.id;
    }
    getList();
});

const remoteMethod = (query) => {
    role.value.name = query;
    getList();
};
const options = ref([]);
const getList = () => {
    loading.value = true;
    roleAPI.list(role.value).then((res) => {
        options.value = res.data.page.list;
        loading.value = false;
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (data) => {
    emit("model", { type: "role", value: data });
};

const clear = () => {
    roleSelect.value.id = "";
}
defineExpose({
    clear
})
</script>
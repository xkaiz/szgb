<template>
    <el-select v-model="certificationSelect.id" filterable remote reserve-keyword placeholder="请选择证书"
        :remote-method="remoteMethod" :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import certificationAPI from '@/api/certification'

const props = defineProps(["id"])
const emit = defineEmits(["model"]);

const certificationSelect = ref({
    id: "",
})
const loading = ref(true);

const certification = ref({
    name: "",
    period: "",
    page: {
        pageNo: 1,
        pageSize: 20
    }
});

onMounted(() => {
    if (props.id != undefined) {
        certificationSelect.value.id = props.id;
    }
    getList();
});

const remoteMethod = (query) => {
    certification.value.name = query;
    getList();
};
const options = ref([]);
const getList = () => {
    loading.value = true;
    certificationAPI.getCertificationList(certification.value).then((res) => {
        options.value = res.data.page.list;
        loading.value = false;
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (value) => {
    emit("model", { type: "certification", id: value });
};

const clear = () => {
    certificationSelect.value.id = "";
}
defineExpose({
    clear
})
</script>
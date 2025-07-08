<template>
    <el-select v-model="schedulePlanTypeSelect" filterable :loading="loading" clearable @change="handleChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name" />
    </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useStore from "@/store/index";
const store = useStore();

const props = defineProps(["form"]);
const emit = defineEmits(["model"]);

const schedulePlanTypeSelect = ref("");
const loading = ref(true);

const options = ref([]);

onMounted(() => {
    getSchedulePlanTypeList();
});

const getSchedulePlanTypeList = () => {
    loading.value = true;
    options.value = store.schedulePlanType;
    loading.value = false;
};

const handleChange = (data) => {
    if (data === "间接") {
        props.form.startAt = "";
        props.form.endAt = "";
    }
    emit("model", { type: "schedulePlanType", value: data });
};

const clear = () => {
    schedulePlanTypeSelect.value = "";
};

defineExpose({
    clear
});
</script>
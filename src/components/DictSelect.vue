<template>
    <el-select v-model="dictSelect" filterable :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.label" />
    </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useStore from "@/store/index";
const store = useStore();

const props = defineProps(["dict", "form"])
const emit = defineEmits(["model"]);

const propsDict = ref({
    cname: "",
    name: ""
})

const dictSelect = ref("")
const loading = ref(true);

onMounted(() => {
    getDictList();
});

const options = ref([]);
const getDictList = () => {
    loading.value = true;
    propsDict.value.cname = props.dict.split("/")[0];
    propsDict.value.name = props.dict.split("/")[1];
    options.value = store.dict.find(item => item.label == propsDict.value.cname).childrenData;
    if (props.form[propsDict.value.name] != "") {
        dictSelect.value = options.value.find(item => item.label == props.form[propsDict.value.name]).label
    }
    loading.value = false;

};

const handelChange = (data) => {
    if (propsDict.value.name == "scheduleType") {
        props.form.startAt = ""
        props.form.endAt = ""
    }
    emit("model", { type: propsDict.value.name, value: data });
};

const clear = () => {
    dictSelect.value = "";
};
defineExpose({
    clear
})
</script>
<template>
    <el-select v-model="dictSelect.id" filterable :loading="loading" clearable @change="handelChange">
        <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useStore from "@/store/index";
const store = useStore();
import dictAPI from '@/api/dict';
import { buildTree } from "@/utils/BuildTree";

const props = defineProps(["dict", "form"])
const emit = defineEmits(["model"]);

const propsDict = ref({
    cname: "",
    name: ""
})

const dictSelect = ref({
    id: "",
})
const loading = ref(true);


onMounted(() => {
    getDictList();
});

const dict = ref({
    page: {
        pageNo: 1,
        pageSize: 20,
        orderBy: ""
    }
});

const options = ref([]);
const getDictList = () => {
    loading.value = true;
    propsDict.value.cname = props.dict.split("/")[0];
    propsDict.value.name = props.dict.split("/")[1];
    dictAPI.list(dict.value).then((res) => {
        store.setDict(buildTree(res.data.dictTree));
        options.value = store.dict.find(item => item.label == propsDict.value.cname).dictChildren;
        dictSelect.value.id = options.value.find(item => item.value == props.form[propsDict.value.name]).value
        loading.value = false;
    }).catch((error) => {
        console.log(error);
    });
};

const handelChange = (value) => {
    emit("model", { type: propsDict.value.name, id: value });
};

const clear = () => {
    dictSelect.value.id = "";
};
defineExpose({
    clear
})
</script>
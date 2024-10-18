<template>
    <el-tree-select v-model="departmentSelect.id" :data="store.departmentList" :render-after-expand="false" filterable
        @change="handelChange" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import useStore from "@/store/index";
const store = useStore();

const props = defineProps(["id"])
const emit = defineEmits(["model"]);

const departmentSelect = ref({
    id: "",
})

onMounted(() => {
    if (props.id != undefined) {
        departmentSelect.value.id = props.id;
    }
});

const handelChange = (value) => {
    emit("model", { type: "department", id: value });
};
</script>
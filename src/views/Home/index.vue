<template>
    <h1>首页</h1>
</template>

<script setup>
import { onMounted } from 'vue';
import useStore from '@/store/index';
const store = useStore();

import departmentAPI from '@/api/Department'
onMounted(() => {
    getDepartmentList()
})

/**
 * 获取部门列表
 * 
 * 本函数通过调用 departmentAPI 中的 getDepartmentList 方法来获取部门列表，
 * 并将获取到的数据存储在 store 中。具体步骤如下：
 * 1. 调用 departmentAPI.getDepartmentList() 方法发送请求获取部门列表数据。
 * 2. 请求成功后，将返回的响应数据中的 data 字段的 data 字段的 data 存储在 store 中。
 * 
 * 注意：本函数依赖于 departmentAPI 模块和 store 模块的正确实现。
 */
const getDepartmentList = () => {
    departmentAPI.getDepartmentList().then((res) => {
        store.setDepartmentList(res.data.data.data)
    })
}

</script>
<template>
    <el-button type="primary" style="width: 100%; height: 100%" @click="buttonClick">按钮</el-button>
</template>

<script setup>
import testAPI from '@/api/Test';

const test = () => {
    return testAPI.test().then(res => {
        console.log(res);
    });
};

const buttonClick = () => {
    test();
};
</script>
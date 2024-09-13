<template>
    <NavBar />
    <el-container>
        <el-aside width="10%">
            <SideBar />
        </el-aside>
        <el-main>
            <AppMain />
        </el-main>
    </el-container>
</template>

<script setup>
import NavBar from '@/layout/NavBar.vue'
import SideBar from '@/layout/SideBar.vue'
import AppMain from '@/layout/AppMain.vue'
defineExpose({
    name: 'Layout',
})
</script>
<template>
    <NavBar />
    <AppMain />
</template>

<script setup>
import NavBar from '@/layout/NavBar.vue'
import AppMain from '@/layout/AppMain.vue'
defineExpose({
    name: 'Layout',
})
</script>
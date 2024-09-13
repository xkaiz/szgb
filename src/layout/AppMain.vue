<template>
    <div class="app-main">
        <router-view :key="key" />
    </div>
</template>
  
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = computed(() => {
    return route.path
})
</script>

<style scoped>
.app-main {
    min-height: calc(100vh - 60px);
    max-width: 100vw;
    position: relative;
    overflow: hidden;
}
</style>
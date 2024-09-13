<template>
    <el-menu :default-active="defaultActive" mode="vertical" router>
        <template v-for="menuItem in menuItems" :key="menuItem.name">
            <el-menu-item :index="menuItem.path" v-if="menuItem.child.length === 0">
                {{ menuItem.name }}
            </el-menu-item>
            <el-sub-menu :index="menuItem.path" v-if="menuItem.child.length > 0">
                <template #title>{{ menuItem.name }}</template>
                <div v-for="lv1Item in menuItem.child" :key="lv1Item.name">
                    <el-menu-item :index="lv1Item.path" v-if="lv1Item.child.length === 0">
                        {{ lv1Item.name }}
                    </el-menu-item>
                    <el-sub-menu :index="lv1Item.path" v-if="lv1Item.child.length > 0">
                        <template #title>{{ lv1Item.name }}</template>
                        <div v-for="lv2Item in lv1Item.child" :key="lv2Item.name">
                            <el-menu-item :index="lv2Item.path" v-if="lv2Item.child.length === 0">
                                {{ lv2Item.name }}
                            </el-menu-item>
                            <el-sub-menu :index="lv2Item.path" v-if="lv2Item.child.length > 0">
                                <template #title>{{ lv2Item.name }}</template>
                                <div v-for="lv3Item in lv2Item.child" :key="lv3Item.name">
                                    <el-menu-item :index="lv3Item.path">
                                        {{ lv3Item.name }}
                                    </el-menu-item>
                                </div>
                            </el-sub-menu>
                        </div>
                    </el-sub-menu>
                </div>
            </el-sub-menu>
        </template>
    </el-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const url = window.location.href
const defaultActive = ref(url.split("/")[3] || "home")

const menuItems = ref([])
const traverseRoutes = (routes) => {
    let menuItem = []
    routes.forEach((route) => {
        if (!route.hasOwnProperty("children")) {
            menuItem.push({
                name: route.meta.title,
                path: route.name,
                child: []
            })
        } else if (route.hasOwnProperty("children")) {
            menuItem.push({
                name: route.meta.title,
                path: route.name,
                child: traverseRoutes(route.children)
            })
        }
    })
    return menuItem
}

onMounted(() => {
    router.options.routes.forEach((route) => {
        if (route.path != "/" && route.path != "/login" && route.path != "/test") {
            if (route.children.length == 1 && !route.children[0].hasOwnProperty("name")) {
                menuItems.value.push({
                    name: route.meta.title,
                    path: route.name,
                    child: []
                })
            } else {
                menuItems.value.push({
                    name: route.meta.title,
                    path: route.name,
                    child: traverseRoutes(route.children)
                })
            }
        }

    })
})
</script>

<style scoped>
.logo {
    margin-left: 1vw;
    margin-right: 1vw;
}
</style>
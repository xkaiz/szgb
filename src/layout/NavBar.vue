<template>
    <el-menu :default-active="defaultActive" mode="horizontal" router>
        <el-image class="logo"
            src="https://tse2-mm.cn.bing.net/th/id/OIP-C.hWv412P3NkAPVB5gmUMzRQAAAA?pid=ImgDet&rs=1"></el-image>
        <template v-for="menuItem in menuItems">
            <el-menu-item :key="menuItem.name" :index="menuItem.path" v-if="menuItem.child.length == 0">
                {{ menuItem.name }}
            </el-menu-item>
            <el-sub-menu :key="menuItem.name" :index="menuItem.path" v-if="menuItem.child.length > 0">
                <template #title>{{ menuItem.name }}</template>
                <div v-for="lv1Item in menuItem.child">
                    <el-menu-item :key="lv1Item.name" :index="lv1Item.path" v-if="lv1Item.child.length == 0">
                        {{ lv1Item.name }}
                    </el-menu-item>
                    <el-sub-menu :key="lv1Item.name" :index="lv1Item.path" v-if="lv1Item.child.length > 0">
                        <template #title>{{ lv1Item.name }}</template>
                        <div v-for="lv2Item in lv1Item.child">
                            <el-menu-item :key="lv2Item.name" :index="lv2Item.path" v-if="lv2Item.child.length == 0">
                                {{ lv2Item.name }}
                            </el-menu-item>
                            <el-sub-menu :key="lv2Item.name" :index="lv2Item.path" v-if="lv2Item.child.length > 0">
                                <template #title>{{ lv2Item.name }}</template>
                                <div v-for="lv3Item in lv2Item.child">
                                    <el-menu-item :key="lv3Item.name" :index="lv3Item.path">
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
        if (route.path != "/") {
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
    console.log(menuItems.value);
})
</script>

<style scoped>
.logo {
    margin-left: 1vw;
    margin-right: 1vw;
}
</style>
  
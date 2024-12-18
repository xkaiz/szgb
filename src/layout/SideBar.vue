<template>
    <el-menu :default-active="defaultActive" :default-openeds="defaultOpeneds" mode="vertical" router>
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

const defaultActive = ref(localStorage.getItem('activeMenu') || 'home')
const defaultOpeneds = JSON.parse(localStorage.getItem('openMenu')) || []

const menuItems = ref([])

const traverseRoutes = (children) => {
    return children.map(child => ({
        name: child.meta.title,
        path: child.path,
        child: child.children ? traverseRoutes(child.children) : [],
    }));
};

const createMenuItems = (routes) => {
    const menuItems = [];
    routes.forEach(route => {
        if (route.path === "/" || route.path === "/login") {
            return;
        }
        const menuItem = {
            name: route.meta.title,
            path: route.path,
            child: route.children && route.path != "/home" ? traverseRoutes(route.children) : [],
        };

        menuItems.push(menuItem);
    });
    return menuItems;
};

onMounted(() => {
    menuItems.value = createMenuItems(router.options.routes)

    router.afterEach((to) => {
        localStorage.setItem('activeMenu', to.path)
    });
});
</script>
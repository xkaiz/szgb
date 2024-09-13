<template>
    <div class="navbar">
        <el-image class="logo"
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.G33rtU6Ho372IeuZldZH0QHaBk?rs=1&pid=ImgDetMain"></el-image>

        <div class="user">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        </div>
    </div>
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
.navbar {
    display: flex;
    justify-content: space-between;
    height: 5%;
    border: 1px solid #dcdfe6;
}

.logo {
    margin-left: 1vw;
    margin-right: 1vw;
}

.user {
    text-align: right;
    margin-right: 1vw;
}
</style>
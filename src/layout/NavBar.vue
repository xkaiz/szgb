<template>
    <div class="navbar">
        <el-image class="logo"
            src="https://tse1-mm.cn.bing.net/th/id/OIP-C.G33rtU6Ho372IeuZldZH0QHaBk?rs=1&pid=ImgDetMain" />
        <el-dropdown>
            <div class="user">
                {{ store.user.name }}
                <el-avatar class="avatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>用户设置</el-dropdown-item>
                    <el-dropdown-item @click="logout">注销登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";

import { useRouter } from "vue-router";
const router = useRouter();
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

const logout = () => {
    //弹窗确认
    ElMessageBox.confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(() => {
        store.logout();
        cookies.remove("token");
        router.push("/login");
    });
};
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    height: 50px;
    border: 1px solid #ccc;
}

.logo {
    margin-left: 1vw;
}

.user {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1vw;
    cursor: pointer;
}

.user:focus,
.user:focus-visible {
    outline: none;
}

.avatar {
    text-align: right;
    margin-left: 1vw;
}
</style>

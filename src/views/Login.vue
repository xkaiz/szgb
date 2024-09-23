<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="100px">
            <h2 class="title">登录</h2>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin" :loading="loginButtonLoading">
                    {{ loginButtonText }}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { md5 } from "@/utils/MD5";
import { useRouter } from "vue-router";
const router = useRouter();
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from "@/store/index";
const store = useStore();

import userAPI from "@/api/User";
import { ElMessage } from "element-plus";

const loginForm = ref({
    username: "admin",
    password: "123456",
    token: "",
});

const userRole = ref({
    user: {
        id: ""
    }
});

const loginFormRef = ref(null);
const rules = {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const loginButtonLoading = ref(false);
const loginButtonText = ref("登录");

const path = ref("home");

onMounted(() => {
    const url = new URL(window.location.href);
    path.value = url.searchParams.get('path') == null ? "home" : url.searchParams.get('path');
    autoLogin();
});

const autoLogin = () => {
    loginForm.value.token = cookies.get("token");
    if (loginForm.value.token) {
        loginButtonLoading.value = true;
        loginButtonText.value = "自动登录中";
        login();
    }
};
const login = () => {
    userAPI.login(loginForm.value).then((res) => {
        cookies.set("token", res.data.sysUser.token);
        getUserRole(res.data.sysUser);
    }).catch(() => {
        loginButtonLoading.value = false;
        loginButtonText.value = "登录";
    })
};

const handleLogin = () => {
    loginButtonLoading.value = true;
    loginButtonText.value = "登录中";
    loginForm.value.password = md5(loginForm.value.password);
    loginFormRef.value.validate((valid) => {
        if (valid) {
            login();
        }
    });
};

const getUserRole = (user) => {
    console.log(user);

    userRole.value.user.id = user.id;
    Promise.all([
        userAPI.getUserRole(userRole.value).then((res) => {
            let roleIds = res.data.page.list.map((item) => {
                return item.id;
            });
            user.role = roleIds.join(",");
            store.setUser(user);
        }),
    ]).then(() => {
        router.push("/" + path.value);
    });
};
</script>

<style scoped>
.login-container {
    width: 300px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
    text-align: center;
    margin-bottom: 20px;
}
</style>

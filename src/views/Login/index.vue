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
                <el-button type="primary" @click="handleLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { md5 } from '@/utils/MD5'
import { useRouter } from 'vue-router'
const router = useRouter();
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import useStore from '@/store/index';
const store = useStore();

import userAPI from '@/api/User'

const loginForm = ref({
    username: 'admin',
    password: '123456',
    token: ''
})
const loginFormRef = ref(null);
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
}
onMounted(() => {
    autoLogin()
})

/**
 * 自动登录函数
 * 
 * 此函数尝试通过用户设备上保存的token进行自动登录
 * 它首先从cookie中获取'token'，如果token存在，则调用getLogin函数执行登录过程
 * 
 * 使用场景：在用户返回应用时，提供无缝的登录体验，避免每次手动登录
 */
const autoLogin = () => {
    // 从cookie中获取保存的token
    loginForm.value.token = cookies.get('token')
    // 如果token存在，则执行登录过程
    if (loginForm.value.token) {
        getLogin()
    }
}

/**
 * 登录函数
 * 此函数用于调用后端API进行用户登录验证
 * 在登录成功时，会显示成功消息，并将登录令牌保存到cookies中，然后导航到主页
 * 登录失败时，会显示错误消息
 */
const getLogin = () => {
    // 调用后端API的getLogin方法进行登录，传递登录表单的值
    userAPI.getLogin(loginForm.value).then(res => {
        // 检查响应状态，如果为200表示登录成功
        if (res.status == 200) {
            // 显示登录成功的消息
            ElMessage.success('登录成功')
            // 将登录返回的令牌保存到cookies中
            cookies.set("token", res.data.data.data.token);
            // 导航到主页
            router.push('/home')
        } else {
            // 显示登录失败的错误消息
            ElMessage.error(res.data.msg)
        }
    })
}

/**
 * 处理登录操作
 * 
 * 本函数用于处理用户的登录操作，主要包含以下步骤：
 * 1. 将用户输入的密码通过MD5加密，以提高安全性
 * 2. 验证登录表单的数据是否合法
 * 3. 如果表单验证通过，则调用登录接口进行登录操作
 */
const handleLogin = () => {
    // 将用户密码进行MD5加密，以确保传输过程中的安全性
    loginForm.value.password = md5(loginForm.value.password)

    // 验证表单内容，如果验证通过，则调用登录接口
    loginFormRef.value.validate(valid => {
        // 如果表单验证通过
        if (valid) {
            // 调用登录接口，执行登录操作
            getLogin()
        }
    })
}

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
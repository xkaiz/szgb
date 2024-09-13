import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const service = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 5000
});
// request 拦截器
service.interceptors.request.use(request => {
    // 每次请求时头信息加上token
    if (cookies.get('token')) {
        request.headers.Authorization = "Bearer "+cookies.get('token')
    }
    return request
})
// response 拦截器
service.interceptors.response.use(response => {
    //返回代码status为401时，跳转到登录页面
    if(response.data.status==401){
        window.location.href = '/login'
    }
    return response
})
export default service

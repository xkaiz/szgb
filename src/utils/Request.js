import axios from "axios";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const service = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 5000
});
// request 拦截器
service.interceptors.request.use(config => {
    // 每次请求时头信息加上token
    if (cookies.get('token')) {
        config.headers.Authorization = "Bearer "+cookies.get('token')
    }
    return config
})
export default service

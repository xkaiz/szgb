import axios from "axios";
import { ElMessage } from "element-plus";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const service = axios.create({
	baseURL: "/api",
	withCredentials: true,
	timeout: 5000,
});
// request 拦截器
service.interceptors.request.use((request) => {
	// 每次请求时头信息加上token
	if (cookies.get("token")) {
		request.headers.Authorization = "Bearer " + cookies.get("token");
	}
	return request;
});
// response 拦截器
service.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status == 401) {
			cookies.remove("token");
			window.location.href = "/login";
		}
	}
);
export default service;

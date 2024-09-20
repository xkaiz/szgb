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
		if (error.response) {
			console.log(error.response.status);
			if (error.response.status == 401) {
				cookies.remove("token");
				window.location.href = "/login";
			} else if (error.response.status == 409) {
				ElMessageErrorGroup(error.response.data.msg);
				return Promise.reject(error);
			} else if (error.response.status != 200) {
				ElMessageErrorGroup("请求失败，请稍候重试");
			}
		} else {
			ElMessageErrorGroup("网络错误，请稍候重试");
		}
	}
);

const ElMessageErrorGroup = (message) => {
	return ElMessage({
		message: message,
		grouping: true,
		type: "error",
	});
};
export default service;

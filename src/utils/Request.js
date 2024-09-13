import axios from "axios";
const service = axios.create({
    baseURL: "/api",
    withCredentials: true,
    timeout: 5000
});

export default service

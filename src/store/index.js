import { defineStore } from "pinia";
import { ref } from "vue";

const useStore = defineStore(
    "index",
    () => {
        const user = ref({});
        const userList = ref([]);
        const departmentList = ref([]);

        const setUser = (data) => {
            user.value = data;
        };

        const setUserList = (data) => {
            userList.value = data;
        };

        const setDepartmentList = (data) => {
            departmentList.value = data;
        };

        const logout = () => {
            user.value = {};
        };

        return {
            user,
            setUser,
            userList,
            setUserList,
            departmentList,
            setDepartmentList,
            logout,
        };
    },
    {
        persist: {
            enabled: true,
        },
    }
);

export default useStore;

import { defineStore } from "pinia";
import { ref } from "vue";

const useStore = defineStore(
	"index",
	() => {
		const user = ref({});
		const userList = ref([]);
		const departmentList = ref([]);
		const roleLevel = ref(0);

		const setUser = (data) => {
			user.value = data;
		};

		const setUserList = (data) => {
			userList.value = data;
		};

		const setDepartmentList = (data) => {
			departmentList.value = data;
		};

		const setRoleLevel = (data) => {
			roleLevel.value = data;
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
			roleLevel,
			setRoleLevel,
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

import { defineStore } from "pinia";
import { ref } from "vue";

const useStore = defineStore(
	"index",
	() => {
		const user = ref({});
		const userList = ref([]);
		const departmentList = ref([]);
		const roleLevel = ref(0);
		const role = ref({});
		const certification = ref({});
		const userRole = ref({});
		const userCertification = ref({});
		const dict = ref({});
		const dictUpdateDate = ref("");
		const schedule = ref({});
		const schedulePlan = ref({});

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

		const setRole = (data) => {
			role.value = data;
		};

		const setCertification = (data) => {
			certification.value = data;
		};

		const setUserRole = (data) => {
			userRole.value = data;
		};

		const setUserCertification = (data) => {
			userCertification.value = data;
		};

		const setDict = (data) => {
			dict.value = data;
		};

		const setDictUpdateDate = (data) => {
			dictUpdateDate.value = data;
		};

		const setSchedule = (data) => {
			schedule.value = data;
		};

		const setSchedulePlan = (data) => {
			schedulePlan.value = data;
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
			role,
			setRole,
			certification,
			setCertification,
			userRole,
			setUserRole,
			userCertification,
			setUserCertification,
			dict,
			setDict,
			dictUpdateDate,
			setDictUpdateDate,
			schedule,
			setSchedule,
			schedulePlan,
			setSchedulePlan,
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

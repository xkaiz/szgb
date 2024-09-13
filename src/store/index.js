import { defineStore } from 'pinia'
import { ref } from 'vue'

const useStore = defineStore('index', () => { 
    const token = ref({})
    const departmentList = ref([])

    const setToken = (key, value) => {
        token.value[key] = value
    }

    const setDepartmentList = (list) => {
        departmentList.value = list
    }

    return {
        token,
        setToken,
        departmentList,
        setDepartmentList
    }
},
{
  persist: {
    enabled: true, 
  },
})

export default useStore
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'

import VueCookies from 'vue3-cookies'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia()
pinia.use(piniaPersistedstate)

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title == undefined ? '数智工班' : to.meta.title
    if (to.meta.requireAuth) {
        if (cookies.get('token')) {
            next()
        } else {
            next({ name: 'login' })
        }
    } else {
        next()
    }
})

createApp(App)
.use(router)
.use(VueCookies)
.use(pinia)
.mount('#app')

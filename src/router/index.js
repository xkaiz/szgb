import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: Layout,
        name: 'home',
        meta: { title: '首页', isHome: true },
        children: [
            {
                path: '/home',
                component: () => import('@/views/Home/index.vue'),
            }
        ]
    },
    {
        path: '/GongNeng',
        component: Layout,
        redirect: '/GongNeng',
        name: 'GongNeng',
        meta: { title: '功能菜单' },
        children: [
            {
                path: '/JiHua',
                component: () => import('@/views/GongNeng/JiHua.vue'),
                name: 'JiHua',
                meta: { title: '计划管理' }
            },
            {
                path: '/MuBan',
                component: () => import('@/views/GongNeng/MuBan.vue'),
                name: 'MuBan',
                meta: { title: '模板管理' }
            },
            {
                path: '/PaiBan',
                component: () => import('@/views/GongNeng/PaiBan.vue'),
                name: 'PaiBan',
                meta: { title: '排班管理' }
            }

        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

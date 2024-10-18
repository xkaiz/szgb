import { createRouter, createWebHistory } from "vue-router";

import Layout from "@/layout/index.vue";

const routes = [
	{
		path: "/",
		redirect: "/login",
	},
	{
		path: "/login",
		component: () => import("@/views/Login.vue"),
		meta: { title: "登录" },
		hidden: true,
	},
	{
		path: "/home",
		component: Layout,
		name: "home",
		meta: { title: "首页", isHome: true },
		children: [
			{
				path: "/home",
				component: () => import("@/views/Home.vue"),
			},
		],
	},
	{
		path: "/PaiBan",
		component: Layout,
		redirect: "/PaiBan",
		name: "PaiBan",
		meta: { title: "排班" },
		children: [
			{
				path: "/JiHua",
				component: () => import("@/views/PaiBan/JiHua.vue"),
				name: "JiHua",
				meta: { title: "计划管理" },
			},
			{
				path: "/PaiBan",
				component: () => import("@/views/PaiBan/BanCi.vue"),
				name: "PaiBan",
				meta: { title: "班次管理" },
			},
			{
				path: "/MuBan",
				component: () => import("@/views/PaiBan/MuBan.vue"),
				name: "MuBan",
				meta: { title: "模板管理" },
			},
		],
	},
	{
		path: "/JiChuShuJu",
		component: Layout,
		redirect: "/JiChuShuJu",
		name: "JiChuShuJu",
		meta: { title: "基础数据" },
		children: [
			{
				path: "/RenYuan",
				component: () => import("@/views/JiChuShuJu/RenYuan.vue"),
				name: "RenYuan",
				meta: { title: "人员管理" },
			},

			{
				path: "/JueSe",
				component: () => import("@/views/JiChuShuJu/JueSe.vue"),
				name: "JueSe",
				meta: { title: "角色管理" },
			},
			{
				path: "/ZhengShu",
				component: () => import("@/views/JiChuShuJu/ZhengShu.vue"),
				name: "ZhengShu",
				meta: { title: "证书管理" },
			},
			{
				path: "/ZiZhi",
				component: () => import("@/views/JiChuShuJu/ZiZhi.vue"),
				name: "ZiZhi",
				meta: { title: "资质管理" },
			},
			{
				path: "/QuanXian",
				component: () => import("@/views/JiChuShuJu/QuanXian.vue"),
				name: "QuanXian",
				meta: { title: "权限管理" },
			},
		],
	},
	{
		path: "/XiTongGuanLi",
		component: Layout,
		redirect: "/XiTongGuanLi",
		name: "XiTongGuanLi",
		meta: { title: "系统管理" },
		children: [
			{
				path: "/ZiDian",
				component: () => import("@/views/JiChuShuJu/ZiDian.vue"),
				name: "ZiDian",
				meta: { title: "数据字典" },
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

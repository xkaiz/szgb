import { createRouter, createWebHistory } from "vue-router";

import Layout from "@/layout/index.vue";

const routes = [
	{
		path: "/",
		redirect: "/home",
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
				path: "/BanCi",
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
		path: "/XiTongGuanLi",
		component: Layout,
		name: "XiTongGuanLi",
		meta: { title: "系统管理" },
		children: [
			{
				path: "/ZiDian",
				component: () => import("@/views/XiTongGuanLi/ZiDian.vue"),
				name: "ZiDian",
				meta: { title: "数据字典" },
			},
			{
				path: "/RenYuan",
				component: () => import("@/views/XiTongGuanLi/RenYuan.vue"),
				name: "RenYuan",
				meta: { title: "人员管理" },
			},

			{
				path: "/JueSe",
				component: () => import("@/views/XiTongGuanLi/JueSe.vue"),
				name: "JueSe",
				meta: { title: "角色管理" },
			},
			{
				path: "/ZhengShu",
				component: () => import("@/views/XiTongGuanLi/ZhengShu.vue"),
				name: "ZhengShu",
				meta: { title: "证书管理" },
			},
			{
				path: "/ZiZhi",
				component: () => import("@/views/XiTongGuanLi/ZiZhi.vue"),
				name: "ZiZhi",
				meta: { title: "资质管理" },
			},
			{
				path: "/QuanXian",
				component: () => import("@/views/XiTongGuanLi/QuanXian.vue"),
				name: "QuanXian",
				meta: { title: "权限管理" },
			},
			{
				path: "/XianLu",
				component: () => import("@/views/XiTongGuanLi/XianLu.vue"),
				name: "XianLu",
				meta: { title: "线路管理" },
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;

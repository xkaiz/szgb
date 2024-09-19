<template>
	<NavBar />
	<el-container class="container">
		<el-aside class="sidebar">
			<SideBar />
		</el-aside>
		<el-main class="main">
			<AppMain />
		</el-main>
	</el-container>
</template>

<script setup>
import NavBar from "@/layout/NavBar.vue";
import SideBar from "@/layout/SideBar.vue";
import AppMain from "@/layout/AppMain.vue";
defineExpose({
	name: "Layout",
});
</script>
<style scoped>
.container {
	height: calc(100vh - 52px);
}
.sidebar {
	width: 10%;
	border: 1px solid #ccc;
}
.main {
	padding: 0;
}
</style>

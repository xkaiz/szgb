<template>
	<h1>首页</h1>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

onMounted(() => {
	const token = cookies.get("token");
	if (token == null || token == "") {
		window.location.href = "/login";
		return
	}
});
</script>

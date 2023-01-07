<script setup lang="ts">
	// 把该文件移动到根目录即可自定义错误（如 404、500）页面样式。

	import { NuxtError } from "nuxt/dist/app/composables/error";
	import Error404 from "layouts/Error404.vue";
	import Error500 from "layouts/Error500.vue";

	const props = withDefaults(defineProps<{
		error: NuxtError; // BUG: TypeScript WCNM，你把多少人的生活，都 TM 给毁了。
	}>(), {
		error: {
			// @ts-ignore
			statusCode: 233,
			message: "乐",
		},
	});

	/**
	 * 判断是否是该错误代码。
	 * @param statusCode - 错误代码。
	 */
	function isStatusCode(...statusCodes: number[]) {
		for (const statusCode of statusCodes)
			// eslint-disable-next-line eqeqeq
			if (props.error.statusCode == statusCode)
				// 没错就是要用二等号。
				return true;
		return false;
	}

	onMounted(() => console.log(props.error));
</script>

<template>
	<Error404 v-if="isStatusCode(404, 233)" :statusCode="error.statusCode" :message="error.message" />
	<Error500 v-else :statusCode="error.statusCode" :message="error.message" :stack="error.stack ?? ''" />
</template>

<script setup lang="ts">
	// 把该文件放在根目录即可自定义错误（如 404、500）页面样式。

	import type { NuxtError } from "nuxt/dist/app/composables/error";
	import { httpResponseStatusCodes } from "helpers/http-status";

	const props = withDefaults(defineProps<{
		error: NuxtError;
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
	 * @returns 是否是该错误代码。
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

	useHead({
		title: httpResponseStatusCodes[props.error.statusCode],
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
		bodyAttrs: { class: "no-scroll" },
	});
</script>

<template>
	<NuxtLayout v-if="isStatusCode(404, 233)" name="error404" :statusCode="error.statusCode" :message="error.message" />
	<NuxtLayout v-else-if="isStatusCode(502)" name="error502" :statusCode="error.statusCode" :message="error.message" />
	<!-- TODO: 对于 301 错误页面的设计，可能需要一个新的参数来传递视频被删除的原因。 -->
	<NuxtLayout v-else-if="isStatusCode(301)" name="error301" :statusCode="error.statusCode" :message="error.message" />
	<NuxtLayout v-else name="error500" :statusCode="error.statusCode" :message="error.message" :stack="error.stack ?? ''" />
</template>

<script setup lang="ts">
	// 把该文件放在根目录即可自定义错误（如 404、500）页面样式。

	import { httpResponseStatusCodes } from "helpers/http-status";
	import type { NuxtError } from "#app";

	const props = withDefaults(defineProps<{
		error: Partial<NuxtError>;
	}>(), {
		error: () => ({
			// @ts-ignore
			status: 233,
			statusText: "乐",
		}),
	});

	/**
	 * 判断是否是该错误代码。
	 * @param statusCodes - 错误代码。
	 * @returns 是否是该错误代码。
	 */
	function isStatusCode(...statusCodes: number[]) {
		for (const statusCode of statusCodes)
			// eslint-disable-next-line eqeqeq
			if (props.error.status == statusCode)
				// 没错就是要用二等号。
				return true;
		return false;
	}

	onMounted(() => console.log(props.error));

	useHead({
		title: httpResponseStatusCodes[props.error.status!],
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
		bodyAttrs: { class: "no-scroll" },
	});
</script>

<template>
	<!-- TODO: 对于 404 错误页面的设计，可能需要一个新的参数来传递视频被删除的原因或者是用户隐藏了等。 -->
	<NuxtLayout v-if="isStatusCode(404, 233)" name="error404" :status="error.status" :type="error.data?.type" />
	<NuxtLayout v-else-if="isStatusCode(403)" name="error403" :status="error.status" :statusText="error.statusText" />
	<NuxtLayout v-else-if="isStatusCode(502)" name="error502" :status="error.status" :statusText="error.statusText" />
	<NuxtLayout v-else name="error500" :status="error.status" :statusText="error.statusText" :stack="error.stack ?? ''" />
</template>

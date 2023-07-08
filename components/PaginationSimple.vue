<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/**
		 * 页码总数。
		 *
		 * 如果该参数是一个字符串数组，则会启用数组模式并显示字符串数组中的内容。
		 */
		pages: number;
		/** 当前页码，单向绑定使用。 */
		current?: number;
		/** 显示在组件上的最多页码数目。 */
		displayPageCount?: number;
		/** 允许用户使用键盘上左右箭头键翻页。 */
		enableArrowKeyMove?: boolean;

		onPageChange: Function;
	}>(), {
		current: 1,
		displayPageCount: 7,
		onPageChange: undefined,
	});

	const pages = [...Array(Math.min(props.displayPageCount, props.pages) + 1).keys()].slice(1);
	console.log(pages);
</script>

<template>
	<span>
		<span
			v-for="page in pages"
			:key="page"
			:class="{ pageNumber: true, currentPage: props.current === page }"
			@click="props.onPageChange(page)"
		>
			{{ page }}

		</span>
	</span>
</template>

<style scoped lang="scss">
	.pageNumber {
		margin: 1px;
		padding: 14px;
		background-color: #ffd3de;
		border: 6px;
		border-radius: 8px;
		cursor: pointer;
	}

	.currentPage {
		background-color: #f06e8e;
	}
</style>
			console.log(numberOfPages.value);

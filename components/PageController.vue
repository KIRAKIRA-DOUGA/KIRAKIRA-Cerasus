<script setup lang="ts">
	import { computed, onMounted } from "vue";

	const props = withDefaults(defineProps<{
		pages: number;
		current?: number;
		displayPageCount: number;
	}>(), {
		current: 1,
	});

	const actualPages = computed(() => Math.min(props.pages, props.displayPageCount));
	const scrolledPages = computed(() => {
		const result: number[] = [];
		for (let i = 2; i < props.pages; i++)
			result.push(i);
		return result;
	});

	const emits = defineEmits<{
		(_event: "changePage", _eventArg: { page: number }): void;
	}>();

	const changePage = (page: number) => emits("changePage", { page });

	onMounted(() => {
		if (props.pages < 1 || props.displayPageCount < 5 || props.current < 1 || props.current > props.pages)
			throw new RangeError("参数错误");
	});
</script>

<template>
	<div class="page">
		<div class="track">
			<PageControllerUnselectedItem :page="1" @click="changePage(1)" />
			<div v-if="(pages >= 3)" class="scrollArea">
				<PageControllerUnselectedItem v-for="i in scrolledPages" :key="`item-${i}`" :page="i" @click="changePage(i)" />
			</div>
			<PageControllerUnselectedItem v-if="(pages >= 2)" :page="pages" @click="changePage(pages)" />
		</div>
		<div class="thumb" contenteditable="true">
			{{ current }}
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@/styles/theme.scss";
	@import "@/styles/ease.scss";
	@import "@/styles/mixin.scss";

	$size: 36px;

	.track {
		background-color: $light-mode-controls-inner-color;
		box-shadow: inset 0 4px 4px #0000000a;
		border-radius: 4px;
		display: flex;
		width: fit-content;
		overflow: hidden;
	}

	.page {
		position: relative;
		user-select: none;
	}

	.thumb {
		@include flex-center;
		position: absolute;
		top: 0;
		left: calc((v-bind(current) - 1) * $size);
		width: $size;
		height: $size;
		background: $brand-pink-50;
		box-shadow: 0 2px 4px #f06e8e99;
		border-radius: 4px;
		color: white;
		cursor: text;
		transition: all $ease-out-max 600ms, left $ease-in-out-max 600ms;
		z-index: 3;

		&:hover {
			background: $brand-pink-30;
			box-shadow: 0 9px 9px #f06e8e4d;
		}

		&:active {
			background: $brand-pink-70;
			transform: scale(calc(35 / 36));
		}
	}

	.scrollArea {
		@include flex-center;
		width: calc((v-bind(actualPages) - 2) * $size);
	}
</style>

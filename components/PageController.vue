<script setup lang="ts">
	import { computed, onMounted } from "vue";

	const props = withDefaults(defineProps<{
		/** 页码数目 */
		pages: number;
		/** 当前页码 */
		current: number;
		/** 显示在组件上的最多页码数目 */
		displayPageCount: number;
		/** 允许用户使用键盘上左右箭头键翻页 */
		enableArrowKeyMove: boolean;
	}>(), {
		current: 1,
		displayPageCount: 7,
		arrowKeyMove: false,
	});

	type PositionPageItem = { [pos: number]: number };

	const actualPages = computed(() => Math.min(props.pages, props.displayPageCount));
	// const scrolledPages = computed(() => getScrolledItems(props.current));
	const scrolledPages = ref<PositionPageItem>(getScrolledItems(props.current));
	const thumbPosition = computed(() => {
		return (
			props.current < actualPages.value / 2 ? props.current :
			props.pages - props.current < actualPages.value / 2 ? actualPages.value - (props.pages - props.current) :
			Math.floor((actualPages.value + 1) / 2)
		) - 1;
	});
	const scrollArea = ref<HTMLDivElement | null>(null);

	const emits = defineEmits<{
		(_event: "changePage", _eventArg: { page: number }): void;
	}>();

	watch(() => props.current, (page, prevPage) => {
		const prevItems = getScrolledItems(prevPage);
		const nextItems = getScrolledItems(page);
		const merged = mergePosition(prevItems, nextItems);
		if (!merged) return;
		scrolledPages.value = merged.items;
		if (!scrollArea.value) return;
		scrollArea.value.animate([
			{ right: 0 },
			{ right: `${merged.finallyPosition * 36}px` },
		], {
			duration: 600,
			easing: "cubic-bezier(1, 0, 0, 1)",
		}).onfinish = () => (scrolledPages.value = getScrolledItems(page));
	});

	onMounted(() => {
		if (props.pages < 1 || props.displayPageCount < 5 || props.current < 1 || props.current > props.pages)
			throw new RangeError("参数错误");
		document.addEventListener("keydown", onArrowKeyDown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("keydown", onArrowKeyDown);
	});

	/**
	 * 改变页码值。
	 * @param page - 新页码值。
	 */
	function changePage(page: number) {
		if (page < 1 || page > props.pages)
			throw new RangeError("超出页码范围");
		emits("changePage", { page });
	}
	/**
	 * 移动页码值。如 +1、-1。
	 * @param movement - 移动页码值。
	 */
	function movePage(movement: number) {
		if (movement === 0) return;
		const newPage = props.current + movement;
		changePage(newPage);
	}
	/**
	 * 当按下键盘按键左右键时翻页。
	 * @param e - 键盘按下事件。
	 */
	function onArrowKeyDown(e: KeyboardEvent) {
		if (!props.enableArrowKeyMove) return;
		const movement =
			e.key === "ArrowLeft" ? -1 :
			e.key === "ArrowRight" ? 1 : 0;
		if (movement) movePage(movement);
	}
	/**
	 * 根据当前页码获取显示在页码控制器滚动区域上的页码项目数组。
	 * @param current - 当前页码。
	 * @returns 显示在页码控制器滚动区域上的页码项目数组。
	 */
	function getScrolledItems(current: number): number[] {
		const result: number[] = [];
		const scrolledItemCount = actualPages.value - 2;
		let left = Math.floor((scrolledItemCount - 1) / 2);
		left = Math.max(current - left, 2);
		let right = left + (scrolledItemCount - 1);
		if (right > props.pages - 1) {
			right = props.pages - 1;
			left = Math.max(right - (scrolledItemCount - 1), 2);
		}
		for (let i = left; i <= right; i++)
			result.push(i);
		return result;
	}
	/**
	 * 合并两个数组，并返回页码项目坐标与页码值的键值对。
	 * @param prevItems - 变化前的页码项目数组。
	 * @param nextItems - 变化后的页码项目数组。
	 * @returns 页码项目坐标与页码值的键值对。
	 */
	function mergePosition(prevItems: number[], nextItems: number[]): {
		items: PositionPageItem;
		finallyPosition: number;
	} | false {
		nextItems = nextItems.filter(item => !prevItems.includes(item));
		if (nextItems.length === 0) return false;
		const result = { items: {} as PositionPageItem, finallyPosition: 1 };
		prevItems.forEach((item, i) => (result.items[i] = item));
		const moveToLeft = nextItems[0] < prevItems[0];
		const prevLength = prevItems.length;
		const nextLength = nextItems.length;
		nextItems.forEach((item, i) => {
			const position = !moveToLeft ? prevLength + i : i - nextLength;
			result.items[position] = item;
		});
		result.finallyPosition = nextItems.length * (moveToLeft ? -1 : 1);
		return result;
	}
</script>

<template>
	<div class="page">
		<div class="track">
			<PageControllerUnselectedItem :page="1" @click="changePage(1)" />
			<div v-if="(pages >= 3)" ref="scrollArea" class="scrollArea">
				<PageControllerUnselectedItem
					v-for="(item, position) in scrolledPages"
					:key="`item-${item}`"
					:page="item"
					:style="{ '--position': position }"
					@click="changePage(item)"
				/>
			</div>
			<PageControllerUnselectedItem v-if="(pages >= 2)" :page="pages" @click="changePage(pages)" />
		</div>
		<div class="thumb" contenteditable="true">
			{{ current }}
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@/styles/colors.scss";
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
		left: calc(v-bind(thumbPosition) * $size);
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
		width: calc((v-bind(actualPages) - 2) * $size);
		height: $size;
		position: relative;
		animation: none;

		> * {
			position: absolute;
			left: calc(var(--position) * $size);
		}
	}
</style>

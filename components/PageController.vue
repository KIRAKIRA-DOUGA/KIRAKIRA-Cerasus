<script setup lang="ts">
	import { computed, onMounted } from "vue";

	const props = withDefaults(defineProps<{
		/** 页码总数。 */
		pages: number;
		/** 当前页码。 */
		current: number;
		/** 显示在组件上的最多页码数目。 */
		displayPageCount?: number;
		/** 允许用户使用键盘上左右箭头键翻页。 */
		enableArrowKeyMove?: boolean;
	}>(), {
		current: 1,
		displayPageCount: 7,
		arrowKeyMove: false,
	});

	/** 页码项目坐标与页码值的键值对。 */
	type PositionPageItemPair = { [pos: number]: number };

	const actualPages = computed(() => Math.min(props.pages, props.displayPageCount));
	const scrolledPages = ref<PositionPageItemPair>(getScrolledItems(props.current));
	const scrollArea = ref<HTMLDivElement>();
	const pageEdit = ref<HTMLDivElement>();
	const thumbPosition = computed(() => {
		return (
			props.current < actualPages.value / 2 ? props.current :
			props.pages - props.current < actualPages.value / 2 ? actualPages.value - (props.pages - props.current) :
			Math.floor((actualPages.value + 1) / 2)
		) - 1;
	});
	const _currentEdited = ref(String(props.current)); // 注意类型得是 string。
	const currentEdited = computed({
		get: () => _currentEdited.value,
		set: async value_str => {
			const caret = getCaret();
			_currentEdited.value = value_str; // 需要设两次来强制刷新。
			await nextTick();
			value_str = value_str.replaceAll(/[^\d]/g, "");
			if (value_str !== "") {
				let value = parseInt(value_str.replaceAll(/[^\d]/g, ""), 10);
				if (value < 1) value = 1;
				else if (value > props.pages) value = props.pages;
				value_str = String(value);
			}
			const requireResetCaret = _currentEdited.value !== value_str;
			_currentEdited.value = value_str;
			await nextTick();
			if (requireResetCaret && caret !== null && pageEdit.value) setCaret(pageEdit.value, caret);
		},
	});
	const isScrolling = ref(false);
	const newPageNumber = ref<HTMLDivElement>();

	const emits = defineEmits<{
		(event: "changePage", arg: { page: number }): void;
	}>();

	watch(() => props.current, (page, prevPage) => {
		//#region 导轨动画
		const prevItems = getScrolledItems(prevPage);
		const nextItems = getScrolledItems(page);
		const merged = mergePosition(prevItems, nextItems);
		const animationOptions = (hasExistAnimations: boolean) => ({
			duration: 500,
			easing: hasExistAnimations ? "cubic-bezier(0, 0, 0, 1)" : "cubic-bezier(1, 0, 0, 1)", // 连续快速滚动时切换成缓出插值。
		});
		if (merged) {
			scrolledPages.value = merged.items;
			if (scrollArea.value) {
				const hasExistAnimations = removeExistAnimations(scrollArea.value);
				isScrolling.value = true;
				scrollArea.value.animate([
					{ right: 0 },
					{ right: `${merged.finallyPosition * 36}px` },
				], animationOptions(hasExistAnimations)).finished.then(() => {
					scrolledPages.value = nextItems;
					isScrolling.value = false;
				});
			}
		}
		//#endregion
		//#region 滑块动画
		const pageLeft = page < prevPage;
		const isUserInputPage = currentEdited.value === String(page);
		if (!isUserInputPage && pageEdit.value && newPageNumber.value) {
			const hasExistAnimations = removeExistAnimations(pageEdit.value, newPageNumber.value);
			if (hasExistAnimations) currentEdited.value = String(prevPage);
			pageEdit.value.animate([
				{ left: 0 },
				{ left: `${pageLeft ? 36 : -36}px` },
			], animationOptions(hasExistAnimations));
			newPageNumber.value.animate([
				{ left: `${pageLeft ? -36 : 36}px` },
				{ left: 0 },
			], animationOptions(hasExistAnimations)).finished.then(() => (currentEdited.value = String(page)));
		} else currentEdited.value = String(page);
		//#endregion
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
		if (newPage < 1 || newPage > props.pages) return;
		changePage(newPage);
	}
	/**
	 * 当按下键盘按键左右键时翻页。
	 * @param e - 键盘按下事件。
	 */
	function onArrowKeyDown(e: KeyboardEvent) {
		if (!props.enableArrowKeyMove || document.activeElement === pageEdit.value) return;
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
		items: PositionPageItemPair;
		finallyPosition: number;
	} | false {
		nextItems = nextItems.filter(item => !prevItems.includes(item));
		if (nextItems.length === 0) return false;
		const result = {} as PositionPageItemPair;
		prevItems.forEach((item, i) => (result[i] = item));
		const moveToLeft = nextItems[0] < prevItems[0],
			prevLength = prevItems.length,
			nextLength = nextItems.length;
		nextItems.forEach((item, i) => {
			const position = !moveToLeft ? prevLength + i : i - nextLength;
			result[position] = item;
		});
		return { items: result, finallyPosition: nextItems.length * (moveToLeft ? -1 : 1) };
	}
	/**
	 * 编辑页码值时按下回车键事件。
	 * @param e - 键盘事件。
	 */
	function onEnterEdited(e: KeyboardEvent) {
		if (e.key === "Enter") {
			if (currentEdited.value.trim() !== "")
				changePage(parseInt(currentEdited.value, 10));
			(e.target as HTMLDivElement).blur();
		}
	}
</script>

<template>
	<div class="page">
		<div class="track">
			<PageControllerUnselectedItem :page="1" @click="changePage(1)" />
			<div class="scrollMask" :class="{ clip: isScrolling }">
				<div v-if="(pages >= 3)" ref="scrollArea" class="scrollArea">
					<PageControllerUnselectedItem
						v-for="(item, position) in scrolledPages"
						:key="`item-${item}`"
						:page="item"
						:style="{ '--position': position }"
						@click="changePage(item)"
					/>
				</div>
			</div>
			<PageControllerUnselectedItem v-if="(pages >= 2)" :page="pages" @click="changePage(pages)" />
		</div>
		<div class="thumb">
			<div class="focusLine"></div>
			<div
				ref="pageEdit"
				contenteditable="true"
				@input="e => currentEdited = (e.target as HTMLDivElement).innerText"
				@keydown="onEnterEdited"
				@blur="() => { if (currentEdited.trim() === '') currentEdited = String(current) }"
			>
				{{ currentEdited }}
			</div>
			<div ref="newPageNumber" class="newPageNumber">{{ current }}</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "assets/scss/theme";

	$size: 36px;

	.track {
		background-color: $light-mode-controls-inner-color;
		box-shadow: inset 0 4px 4px #0000000a;
		border-radius: 4px;
		display: flex;
		width: fit-content;
		overflow: hidden;
		position: relative;
	}

	.page {
		position: relative;
		user-select: none;
	}

	.thumb {
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
		transition: all $ease-out-max 500ms, left $ease-in-out-max 500ms;
		z-index: 3;
		text-align: center;
		line-height: $size;
		overflow: hidden;
		font-weight: bold;

		&:hover {
			background: $brand-pink-30;
			box-shadow: 0 9px 9px #f06e8e4d;
		}

		&:active {
			background: $brand-pink-70;
			transform: scale(calc(35 / 36));
		}

		&:has(:focus) {
			box-shadow: 0 2px 4px #f06e8e99, 0 0 0 3px #f8afb880;

			> .focusLine {
				top: 0;
			}
		}

		> .focusLine {
			$line-height: 2px;
			border-bottom: $brand-pink-10 $line-height solid;
			top: $line-height;
			pointer-events: none;
		}

		> * {
			width: 100%;
			height: 100%;
			position: absolute;
		}

		> .newPageNumber {
			top: 0;
			left: -$size;
		}
	}

	.scrollMask.clip {
		overflow: hidden;
	}

	.scrollArea {
		position: relative;

		&,
		.scrollMask {
			width: calc((v-bind(actualPages) - 2) * $size);
			height: $size;
		}

		> * {
			position: absolute;
			left: calc(var(--position) * $size);
		}
	}
</style>

<script setup lang="tsx">
	const props = withDefaults(defineProps<{
		/** 页码总数。 */
		pages: number;
		/** 当前页码。 */
		modelValue?: number;
		/** 当前页码，兼容使用。 */
		current?: number;
		/** 显示在组件上的最多页码数目。 */
		displayPageCount?: number;
		/** 允许用户使用键盘上左右箭头键翻页。 */
		enableArrowKeyMove?: boolean;
	}>(), {
		modelValue: undefined,
		current: 1,
		displayPageCount: 7,
		enableArrowKeyMove: false,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", page: number): void;
	}>();

	const currentPage = computed(() => props.modelValue ?? props.current);

	if (props.pages < 1)
		throw new RangeError(`PageController pages 参数错误。页码值不能小于 1，当前值为 ${props.pages}。`);
	if (currentPage.value < 1 || currentPage.value > props.pages)
		throw new RangeError(`PageController current 超出页码范围。当前页码值取值范围为 1 ~ ${props.pages}，当前设定值为 ${currentPage.value}。`);
	if (props.displayPageCount < 3)
		throw new RangeError(`PageController displayPageCount 参数错误。显示的最多页码数目不能小于 3，当前设定值为 ${props.displayPageCount}。`);

	/** 页码项目坐标与页码值的键值对。 */
	type PositionPageItemPair = Record<number, number>;

	const showLast = computed(() => props.displayPageCount >= 5);
	const showFirst = computed(() => props.displayPageCount >= 4);
	const actualPages = computed(() => Math.min(props.pages, props.displayPageCount));
	const scrolledItemCount = computed(() => actualPages.value - (+showFirst.value + +showLast.value));
	const scrolledPages = ref<PositionPageItemPair>(getScrolledItems(currentPage.value));
	const scrollArea = ref<HTMLDivElement>();
	const pageEdit = ref<HTMLDivElement>();
	const thumbPosition = computed(() => {
		return (
			currentPage.value < actualPages.value / 2 ? currentPage.value :
			props.pages - currentPage.value < actualPages.value / 2 ? actualPages.value - (props.pages - currentPage.value) :
			props.displayPageCount === 4 && currentPage.value !== 2 ? 3 :
			Math.floor((actualPages.value + 1) / 2)
		) - 1;
	});
	const _currentEdited = ref(String(currentPage.value)); // 注意类型得是 string。
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

	watch(() => currentPage.value, (page, prevPage) => {
		//#region 导轨动画
		const prevItems = getScrolledItems(prevPage);
		const nextItems = getScrolledItems(page);
		const merged = mergePosition(prevItems, nextItems);
		const animationOptions = (hasExistAnimations: boolean) => ({
			duration: 500,
			easing: hasExistAnimations ? eases.easeOutMax : eases.easeInOutSmooth, // 连续快速滚动时切换成缓出插值。
		});
		/** `Uncaught (in promise) DOMException: The user aborted a request.` 给👴爬！ */
		const IGNORE = () => { };
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
				}).catch(IGNORE);
			}
		}
		//#endregion
		//#region 滑块动画
		const pageLeft = page < prevPage;
		const isUserInputPage = currentEdited.value === String(page);
		if (!isUserInputPage && pageEdit.value && newPageNumber.value) {
			const thumb = pageEdit.value.parentElement!;
			const hasExistAnimations = removeExistAnimations(pageEdit.value, newPageNumber.value);
			if (hasExistAnimations) {
				currentEdited.value = String(prevPage);
				thumb.style.transitionTimingFunction = eases.easeOutMax;
			}
			newPageNumber.value.hidden = false;
			pageEdit.value.animate([
				{ left: 0 },
				{ left: `${pageLeft ? 36 : -36}px` },
			], animationOptions(hasExistAnimations));
			newPageNumber.value.animate([
				{ left: `${pageLeft ? -36 : 36}px` },
				{ left: 0 },
			], animationOptions(hasExistAnimations)).finished.then(() => {
				currentEdited.value = String(page);
				if (newPageNumber.value) newPageNumber.value.hidden = true;
				thumb.style.removeProperty("transition-timing-function");
			}).catch(IGNORE);
		} else currentEdited.value = String(page);
		//#endregion
	});

	onMounted(() => {
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
			throw new RangeError(`超出页码范围。当前页码值取值范围为 1 ~ ${props.pages}，当前设定值为 ${page}。`);
		emits("update:modelValue", page);
	}
	/**
	 * 移动页码值。如 +1、-1。
	 * @param movement - 移动页码值。
	 */
	function movePage(movement: number) {
		if (movement === 0) return;
		const newPage = currentPage.value + movement;
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
		const scrolledItemCount_1 = scrolledItemCount.value - 1;
		let left = Math.floor(scrolledItemCount_1 / 2);
		left = Math.max(current - left, 1 + +showFirst.value);
		let right = left + scrolledItemCount_1;
		if (right > props.pages - +showLast.value) {
			right = props.pages - +showLast.value;
			left = Math.max(right - scrolledItemCount_1, 1 + +showFirst.value);
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
	/**
	 * 编辑页码值时失焦事件。
	 * 此时应当取消选中文本。
	 */
	function onBlurEdited() {
		if (currentEdited.value.trim() === "")
			currentEdited.value = String(currentPage.value);
		window.getSelection()?.removeAllRanges();
	}

	const styles = useCssModule("unselectedItem");
	/** 未选中项目组件。 */
	const UnselectedItem = (props: { page: number }) => (
		<div class={styles.unselectedItem}>
			<div class={[styles.background, styles.hover]}></div>
			<div class={[styles.background, styles.pressed]}></div>
			{/* 按下状态统一叫 pressed 不叫 active 是为了与活跃状态区分开。 */}
			<span>{props.page}</span>
		</div>
	);
</script>

<template>
	<div class="page">
		<div class="track">
			<UnselectedItem v-if="showFirst" :page="1" @click="changePage(1)" />
			<div class="scroll-mask" :class="{ clip: isScrolling }">
				<div v-if="(pages >= 3)" ref="scrollArea" class="scroll-area">
					<UnselectedItem
						v-for="(item, position) in scrolledPages"
						:key="`item-${item}`"
						:page="item"
						:style="{ '--position': position }"
						@click="changePage(item)"
					/>
				</div>
			</div>
			<UnselectedItem v-if="(pages >= 2 && showLast)" :page="pages" @click="changePage(pages)" />
		</div>
		<div v-ripple class="thumb">
			<div class="focus-line"></div>
			<div
				ref="pageEdit"
				class="page-edit"
				contenteditable="true"
				@input="e => currentEdited = (e.target as HTMLDivElement).innerText"
				@keydown="onEnterEdited"
				@blur="onBlurEdited"
			>
				{{ currentEdited }}
			</div>
			<div ref="newPageNumber" class="new-page-number">{{ currentPage }}</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$size: 36px;

	.track {
		@include control-inner-shadow;
		@include radius-small;
		position: relative;
		display: flex;
		width: fit-content;
		overflow: hidden;
		background-color: c(inner-color);
	}

	.page {
		position: relative;
		user-select: none;
	}

	.thumb {
		@include page-active;
		@include square($size);
		@include radius-small;
		position: absolute;
		top: 0;
		left: calc(v-bind(thumbPosition) * $size);
		z-index: 3;
		overflow: hidden;
		color: white;
		font-weight: bold;
		line-height: $size;
		text-align: center;
		background: c(accent);
		cursor: text;
		transition: $fallback-transitions, all $ease-out-max 500ms, left $ease-in-out-smooth 500ms;

		&:hover {
			@include button-shadow-hover;
			background: c(accent-hover);

			&:has(:focus) {
				@include button-shadow-hover-focus;
			}
		}

		&:active {
			background: c(accent);
			transform: scale(calc(35 / 36));
		}

		&:has(:focus) {
			@include button-shadow-focus;

			> .focus-line {
				top: 0;
			}
		}

		> .focus-line {
			$line-height: 2px;
			top: $line-height;
			border-bottom: c(accent-10) $line-height solid;
			pointer-events: none;
		}

		> * {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		> .new-page-number {
			top: 0;
			left: -$size;
		}

		> .page-edit {
			position: absolute;
			top: 0;
		}

		::selection {
			color: c(accent);
			background-color: #fff9;
		}
	}

	.scroll-mask.clip {
		overflow: hidden;
	}

	.scroll-area {
		position: relative;

		&,
		.scroll-mask {
			width: calc(v-bind(scrolledItemCount) * $size);
			height: $size;
		}

		> * {
			position: absolute;
			left: calc(var(--position) * $size);
		}
	}
</style>

<style module="unselectedItem" lang="scss">
	$size: 36px;

	.unselected-item {
		@include flex-center;
		flex-shrink: 0;

		width: $size;
		height: $size;
		color: c(icon-color);
		cursor: pointer;
		transition: none !important;
		-webkit-tap-highlight-color: transparent;

		:where(&) {
			position: relative;
		}

		& > span {
			position: relative;
			z-index: 2;
		}

		.background {
			position: absolute;
			z-index: 0 !important;
			flex-shrink: 0;
			width: 300%;
			height: 100%;
			color: gray;
			opacity: 0;
			pointer-events: none;

			&.hover {
				background: radial-gradient(50% 250% at 50% 50%, c(gray) 33.33%, c(gray, 0) 100%);
			}

			&.pressed {
				background: radial-gradient(50% 250% at 50% 50%, c(gray-2) 33.33%, c(gray-2, 0) 100%);
			}
		}

		&:hover:not(:active) .background.hover,
		&:active .background.pressed {
			opacity: 1;
		}
	}
</style>

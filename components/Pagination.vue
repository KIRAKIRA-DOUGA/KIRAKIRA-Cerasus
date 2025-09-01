<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/**
		 * 页码总数。
		 *
		 * 如果该参数是一个字符串数组，则会启用数组模式并显示字符串数组中的内容。
		 */
		pages: number | string[];
		/** 当前页码，单向绑定使用。 */
		current?: number;
		/** 显示在组件上的最多页码数目。 */
		displayPageCount?: number;
		/** 允许用户使用键盘上左右箭头键翻页。 */
		enableArrowKeyMove?: boolean;
		/** 禁用？ */
		disabled?: boolean;
	}>(), {
		current: 1,
		displayPageCount: 7,
		disabled: false,
	});

	const model = defineModel<number>();
	const currentPage = withOneWayProp(model, () => props.current);
	const array = computed(() => props.pages instanceof Array ? props.pages : null);
	const pages = computed(() => !(props.pages instanceof Array) ? props.pages : props.pages.length);

	if (pages.value < 1)
		throw new RangeError(`Pagination pages 参数错误。页码值不能小于 1，当前值为 ${pages.value}。`);
	if (currentPage.value < 1 || currentPage.value > pages.value)
		throw new RangeError(`Pagination current 超出页码范围。当前页码值取值范围为 1 ~ ${pages.value}，当前设定值为 ${currentPage.value}。`);
	if (props.displayPageCount < 3)
		throw new RangeError(`Pagination displayPageCount 参数错误。显示的最多页码数目不能小于 3，当前设定值为 ${props.displayPageCount}。`);

	/** 页码项目坐标与页码值的键值对。 */
	type PositionPageItemPair = Record<number, number>;

	const showLast = computed(() => props.displayPageCount >= 5);
	const showFirst = computed(() => props.displayPageCount >= 4);
	const actualPages = computed(() => Math.min(pages.value, props.displayPageCount));
	const scrolledItemCount = computed(() => actualPages.value - (+showFirst.value + +showLast.value));
	const scrolledPages = ref<PositionPageItemPair>(getScrolledItems(currentPage.value));
	const scrollArea = ref<HTMLDivElement>();
	const pageEdit = ref<HTMLDivElement>();
	const thumbPosition = computed(() => {
		return (
			currentPage.value < actualPages.value / 2 ? currentPage.value :
			pages.value - currentPage.value < actualPages.value / 2 ? actualPages.value - (pages.value - currentPage.value) :
			props.displayPageCount === 4 && currentPage.value !== 2 ? 3 :
			Math.floor((actualPages.value + 1) / 2)
		) - 1;
	});
	const _currentEdited = ref(String(currentPage.value)); // 注意类型得是 string。
	const currentEdited = computed({
		get: () => _currentEdited.value,
		set: async value_str => {
			const caret = Caret.get();
			_currentEdited.value = value_str; // 需要设两次来强制刷新。
			await nextTick();
			value_str = value_str.replaceAll(/[^\d]/g, "");
			if (value_str !== "") {
				let value = parseInt(value_str.replaceAll(/[^\d]/g, ""), 10);
				if (value < 1) value = 1;
				else if (value > pages.value) value = pages.value;
				value_str = String(value);
			}
			const requireResetCaret = _currentEdited.value !== value_str;
			_currentEdited.value = value_str;
			await nextTick();
			if (requireResetCaret && caret !== null && pageEdit.value) Caret.set(pageEdit.value, caret);
		},
	});
	const isScrolling = ref(false);
	const isForceSmallRipple = ref(false);
	const newPageNumber = ref<HTMLDivElement>();
	const [DefineUnselectedItem, UnselectedItem] = createReusableTemplate<{
		page: number;
		position?: number;
	}>();

	watch(() => currentPage.value, (page, prevPage) => {
		// #region 导轨动画
		const prevItems = getScrolledItems(prevPage);
		const nextItems = getScrolledItems(page);
		const merged = mergePosition(prevItems, nextItems);
		const animationOptions = (hasExistAnimations: boolean) => ({
			duration: isPrefersReducedMotion() ? 0 : 500,
			easing: hasExistAnimations ? eases.easeOutMax : eases.easeInOutSmooth, // 连续快速滚动时切换成缓出插值。
		});
		// `Uncaught (in promise) DOMException: The user aborted a request.` 给👴爬！
		const IGNORE = useNoop;
		if (merged) {
			scrolledPages.value = merged.items;
			if (scrollArea.value)
				for (const _child of scrollArea.value.children) {
					const child = _child.children[0];
					if (!child) continue;
					const hasExistAnimations = removeExistAnimations(child);
					isScrolling.value = true;
					child.animate({
						right: ["0", `${merged.finallyPosition * 36}px`],
					}, animationOptions(hasExistAnimations)).finished.then(() => {
						scrolledPages.value = nextItems;
						isScrolling.value = false;
					}).catch(IGNORE);
				}
		}
		// #endregion
		// #region 滑块动画
		const pageLeft = page < prevPage;
		const setCurrentPage = () => currentEdited.value = String(page);
		if (pageEdit.value && newPageNumber.value) {
			const thumb = pageEdit.value.parentElement!.parentElement!;
			const hasExistAnimations = removeExistAnimations(pageEdit.value, newPageNumber.value);
			const isUserInputPage = currentEdited.value === String(page) && !hasExistAnimations;
			if (!isUserInputPage) {
				if (hasExistAnimations) {
					currentEdited.value = String(prevPage);
					thumb.style.transitionTimingFunction = eases.easeOutMax;
				}
				newPageNumber.value.hidden = false;
				if (!merged) isForceSmallRipple.value = true;
				pageEdit.value.animate({
					left: ["0", `${pageLeft ? 36 : -36}px`],
				}, animationOptions(hasExistAnimations));
				newPageNumber.value.animate({
					left: [`${pageLeft ? -36 : 36}px`, "0"],
				}, animationOptions(hasExistAnimations)).finished.then(() => {
					setCurrentPage();
					if (newPageNumber.value) newPageNumber.value.hidden = true;
					thumb.style.removeProperty("transition-timing-function");
					isForceSmallRipple.value = false;
				}).catch(IGNORE);
			} else setCurrentPage();
		} else setCurrentPage();
		// #endregion
	});

	onMounted(() => {
		document.addEventListener("keydown", onArrowKeydown);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("keydown", onArrowKeydown);
	});

	/**
	 * 改变页码值。
	 * @param page - 新页码值。
	 */
	function changePage(page: number) {
		if (page < 1 || page > pages.value)
			throw new RangeError(`超出页码范围。当前页码值取值范围为 1 ~ ${pages.value}，当前设定值为 ${page}。`);
		model.value = page;
	}
	/**
	 * 移动页码值。如 +1、-1。
	 * @param movement - 移动页码值。
	 */
	function movePage(movement: number) {
		if (movement === 0) return;
		const newPage = currentPage.value + movement;
		if (newPage < 1 || newPage > pages.value) return;
		changePage(newPage);
	}
	/**
	 * 当按下键盘按键左右键时翻页。
	 * @param e - 键盘按下事件。
	 */
	function onArrowKeydown(e: KeyboardEvent) {
		if (!props.enableArrowKeyMove || document.activeElement === pageEdit.value) return;
		const movement =
			e.code === "ArrowLeft" ? -1 :
			e.code === "ArrowRight" ? 1 : 0;
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
		if (right > pages.value - +showLast.value) {
			right = pages.value - +showLast.value;
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
		prevItems.forEach((item, i) => result[i] = item);
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
		if (e.code === "Enter") {
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

	/**
	 * 根据页码索引值获取页码索引值（大雾）。
	 *
	 * 其实是为了兼容数组模式。
	 * @param index - 页码索引值。其中唯一一次用到字符串参数类型是在用户输入文本跳页的时候。
	 * @returns 页码索引值或数组中的内容。
	 */
	function getPageName(index: number | string) {
		return !array.value ? index : array.value[+index - 1];
	}
</script>

<template>
	<DefineUnselectedItem v-slot="{ page, position }">
		<SoftButton
			nonfocusable
			:style="{ '--position': position }"
			:text="getPageName(page)"
			:aria-label="t.switch_page_label(page)"
			:aria-selected="currentPage === page"
			:aria-current="currentPage === page && 'page'"
			@click="changePage(page)"
		/>
	</DefineUnselectedItem>

	<Comp
		:inert="disabled"
		role="slider"
		aria-orientation="horizontal"
		:aria-label="t.current_page_label(currentPage, pages)"
		:aria-valuenow="currentPage"
		:aria-valuemin="1"
		:aria-valuemax="pages"
	>
		<div class="track" :class="{ 'small-ripple': isForceSmallRipple }">
			<UnselectedItem v-if="showFirst" :page="1" />
			<div
				v-if="pages >= 3"
				ref="scrollArea"
				class="scroll-area"
				:class="{ 'is-scrolling': isScrolling }"
			>
				<div class="ripples">
					<div>
						<UnselectedItem v-for="(item, position) in scrolledPages" :key="item" :position="position" :page="item" />
					</div>
				</div>
				<div class="texts">
					<div>
						<div
							v-for="(item, position) in scrolledPages"
							:key="item"
							:style="{ '--position': position }"
						>{{ getPageName(item) }}</div>
					</div>
				</div>
			</div>
			<UnselectedItem v-if="pages >= 2 && showLast" :page="pages" />
		</div>
		<div v-ripple class="thumb">
			<form>
				<div
					ref="pageEdit"
					class="page-edit"
					:contenteditable="!array"
					inputmode="numeric"
					@input="e => currentEdited = (e.target as HTMLDivElement).innerText"
					@keydown="onEnterEdited"
					@blur="onBlurEdited"
				>
					{{ getPageName(currentEdited) }}
				</div>
			</form>
			<div ref="newPageNumber" class="new-page-number">{{ getPageName(currentPage) }}</div>
			<div class="focus-stripe"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$size: 36px;
	$ripple-size: 48px;
	$focus-stripe-height: 2px;

	.track {
		@include control-inner-shadow;
		@include round-small;
		position: relative;
		display: flex;
		width: fit-content;
		overflow: clip;
		background-color: c(inset-bg);

		.soft-button {
			--wrapper-size: #{$size};
			--ripple-size: #{$ripple-size};
			transition: $fallback-transitions, left 0s;
		}

		&.small-ripple .soft-button :deep(button) {
			&:has(> .ripple-circle):not(:hover, :active) {
				@include square(var(--wrapper-size) !important);
			}
		}

		.texts {
			overflow: clip;
			pointer-events: none;

			> * > * {
				@include square($size);
				@include flex-center;
				color: c(icon-color);
				font-weight: 600;
				transition: $fallback-transitions, left 0s;
			}
		}
	}

	:comp {
		position: relative;
		user-select: none;

		&[inert] {
			opacity: 0.4;
		}
	}

	.thumb {
		@include page-active;
		@include square($size);
		@include round-small;
		position: absolute;
		top: 0;
		left: calc(v-bind(thumbPosition) * $size);
		z-index: 3;
		overflow: clip;
		color: white;
		font-weight: bold;
		line-height: $size;
		text-align: center;
		background-color: c(accent);
		transition: $fallback-transitions, all $ease-out-back 500ms, left $ease-in-out-smooth 500ms;

		&:any-hover {
			@include button-shadow-hover;
			background: c(accent-hover);

			&:has(:focus) {
				@include button-shadow-hover-focus;
			}
		}

		&:active {
			@include button-scale-pressed;
			background: c(accent);
		}

		&:has(:focus) {
			@include button-shadow-focus;

			> .focus-stripe {
				top: 0;
			}
		}

		.focus-stripe {
			$focus-stripe-height: 2px;
			top: $focus-stripe-height;
			border-bottom: c(accent-10) $focus-stripe-height solid;
			pointer-events: none;
		}

		> *,
		.page-edit {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		.new-page-number {
			top: 0;
			left: -$size;
		}

		.page-edit {
			position: absolute;
			top: 0;

			&[contenteditable="true"] {
				cursor: text;
			}
		}

		::selection {
			color: c(accent);
			background-color: c(accented-selection);
		}
	}

	%scroll-area-size {
		position: relative;
		width: calc(v-bind(scrolledItemCount) * $size);
		height: $size;
	}

	.scroll-area {
		@extend %scroll-area-size;

		.soft-button {
			color: transparent;
		}

		&.is-scrolling :deep(*::before) {
			pointer-events: none;
		}

		> * {
			@include square(100%);
			position: absolute;
			top: 0;

			> * {
				@extend %scroll-area-size;

				> * {
					position: absolute;
					left: calc(var(--position) * $size);
				}
			}
		}
	}
</style>

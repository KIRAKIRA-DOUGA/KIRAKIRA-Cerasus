<docs>
	# 滚动容器

	自制滚动条，支持垂直和水平方向，支持控制滚动条的边距。
	将组件套在外层，内部的内容将会自动判断是否需要滚动条。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		overflowX?: "visible" | "hidden" | "clip" | "scroll" | "auto";
		overflowY?: "visible" | "hidden" | "clip" | "scroll" | "auto";
	}>(), {
		overflowX: "auto",
		overflowY: "auto",
	});

	const scrollerEl = ref<HTMLDivElement>();
	const contentEl = ref<HTMLDivElement>();

	const pointerType = ref("touch");

	const scrollableVertical = ref(false);
	const scrollableHorizontal = ref(false);

	const draggingVertical = ref(false);
	const draggingHorizontal = ref(false);

	const trackVertical = ref<HTMLDivElement>();
	const thumbVertical = ref<HTMLDivElement>();
	const thumbVerticalHeight = ref(0); // 百分比
	const thumbVerticalTop = ref(0); // 百分比

	const trackHorizontal = ref<HTMLDivElement>();
	const thumbHorizontal = ref<HTMLDivElement>();
	const thumbHorizontalWidth = ref(0); // 百分比
	const thumbHorizontalLeft = ref(0); // 百分比

	const thumbVerticalScaleX = ref(1);
	const thumbHorizontalScaleY = ref(1);

	const showVertical = ref(false);
	const showHorizontal = ref(false);
	const hideVerticalTimeout = ref<Timeout>();
	const hideHorizontalTimeout = ref<Timeout>();
	/** 指定在鼠标移出区域多久后自动隐藏。 */
	const WAITING = 1000;

	/**
	 * 更新滚动条位置。
	 */
	function updateScrollPercentage() {
		if (!scrollerEl.value) return;

		/** 判断是否需要显示滚动条 */
		scrollableVertical.value = (props.overflowY === "scroll" || props.overflowY === "auto") && scrollerEl.value.scrollHeight > scrollerEl.value.clientHeight;
		scrollableHorizontal.value = (props.overflowX === "scroll" || props.overflowX === "auto") && scrollerEl.value.scrollWidth > scrollerEl.value.clientWidth;

		/** 垂直滚动条 */
		const scrollTop = scrollerEl.value.scrollTop;
		const maxScrollTop = scrollerEl.value.scrollHeight - scrollerEl.value.clientHeight;
		let overscroll = 0;
		if (scrollTop < 0)
			overscroll = -scrollTop;
		else if (scrollTop > maxScrollTop)
			overscroll = scrollTop - maxScrollTop;

		/** overscroll 时缩放 thumb 宽度 */
		const baseThumbHeight = scrollerEl.value.clientHeight / scrollerEl.value.scrollHeight * 100;
		const squeezedThumbHeight = Math.max(baseThumbHeight - overscroll * 100 / scrollerEl.value.scrollHeight, 10);
		const verticalScale = 1 - Math.min(overscroll / scrollerEl.value.clientHeight, 0.8); // 最多缩小 80%
		thumbVerticalScaleX.value = verticalScale;

		/** 超出边界时固定在边缘 */
		let newThumbTopPercentage = 0;
		if (scrollTop < 0)
			newThumbTopPercentage = 0;
		else if (scrollTop > maxScrollTop)
			newThumbTopPercentage = 100 - squeezedThumbHeight;
		else
			newThumbTopPercentage = scrollerEl.value.scrollTop / scrollerEl.value.scrollHeight * 100;

		thumbVerticalHeight.value = squeezedThumbHeight;
		thumbVerticalTop.value = newThumbTopPercentage;

		/** 水平滚动条 */
		const scrollLeft = scrollerEl.value.scrollLeft;
		const maxScrollLeft = scrollerEl.value.scrollWidth - scrollerEl.value.clientWidth;
		let overscrollX = 0;
		if (scrollLeft < 0)
			overscrollX = -scrollLeft;
		else if (scrollLeft > maxScrollLeft)
			overscrollX = scrollLeft - maxScrollLeft;

		/** overscroll 时缩放 thumb 高度 */
		const baseThumbWidth = scrollerEl.value.clientWidth / scrollerEl.value.scrollWidth * 100;
		const squeezedThumbWidth = Math.max(baseThumbWidth - overscrollX * 100 / scrollerEl.value.scrollWidth, 10);
		const horizontalScale = 1 - Math.min(overscrollX / scrollerEl.value.clientWidth, 0.8); // 最多缩小 80%
		thumbHorizontalScaleY.value = horizontalScale;

		/** 超出边界时固定在边缘 */
		let newThumbLeftPercentage = 0;
		if (scrollLeft < 0)
			newThumbLeftPercentage = 0;
		else if (scrollLeft > maxScrollLeft)
			newThumbLeftPercentage = 100 - squeezedThumbWidth;
		else
			newThumbLeftPercentage = scrollerEl.value.scrollLeft / scrollerEl.value.scrollWidth * 100;

		thumbHorizontalWidth.value = squeezedThumbWidth;
		thumbHorizontalLeft.value = newThumbLeftPercentage;
	}

	/**
	 * 准备倒计时隐藏垂直滚动条。
	 */
	function readyToHideVertical() {
		clearTimeout(hideVerticalTimeout.value);
		hideVerticalTimeout.value = setTimeout(() => {
			showVertical.value = false;
		}, WAITING);
	}

	/**
	 * 准备倒计时隐藏水平滚动条。
	 */
	function readyToHideHorizontal() {
		clearTimeout(hideHorizontalTimeout.value);
		hideHorizontalTimeout.value = setTimeout(() => {
			showHorizontal.value = false;
		}, WAITING);
	}

	/**
	 * 用户滚动或者内容大小改变。
	 */
	function onScrollChange() {
		updateScrollPercentage();
		showVertical.value = true;
		readyToHideVertical();
		showHorizontal.value = true;
		readyToHideHorizontal();
	}

	/**
	 * 按下垂直滚动条时拖动滚动条。
	 * @param e - 指针事件。
	 */
	function onThumbVerticalDown(e: PointerEvent) {
		draggingVertical.value = true;
		const thumbRect = thumbVertical.value!.getBoundingClientRect();
		const startOffsetY = e.clientY - thumbRect.top;
		clearTimeout(hideVerticalTimeout.value);

		function changeValue(e: PointerEvent) {
			if (!scrollerEl.value) return;
			const trackRect = trackVertical.value!.getBoundingClientRect();
			const thumbHeight = thumbVertical.value!.getBoundingClientRect().height;
			const scrollHeight = scrollerEl.value.scrollHeight - scrollerEl.value.clientHeight;
			const scrollPercentage = (e.clientY - trackRect.top - startOffsetY) / (trackRect.height - thumbHeight);
			scrollerEl.value.scrollTop = scrollHeight * scrollPercentage;
		}

		function onThumbVerticalUp() {
			draggingVertical.value = false;
			readyToHideVertical();
			document.removeEventListener("pointermove", changeValue);
			document.removeEventListener("lostpointercapture", onThumbVerticalUp);
			document.removeEventListener("pointerup", onThumbVerticalUp);
		}

		document.addEventListener("pointermove", changeValue);
		document.addEventListener("lostpointercapture", onThumbVerticalUp);
		document.addEventListener("pointerup", onThumbVerticalUp);
	}

	/**
	 * 按下水平滚动条时拖动滚动条。
	 * @param e - 指针事件。
	 */
	function onThumbHorizontalDown(e: PointerEvent) {
		draggingHorizontal.value = true;
		const thumbRect = thumbHorizontal.value!.getBoundingClientRect();
		const startOffsetX = e.clientX - thumbRect.left;
		clearTimeout(hideHorizontalTimeout.value);

		function changeValue(e: PointerEvent) {
			if (!scrollerEl.value) return;
			const trackRect = trackHorizontal.value!.getBoundingClientRect();
			const thumbWidth = thumbHorizontal.value!.getBoundingClientRect().width;
			const scrollWidth = scrollerEl.value.scrollWidth - scrollerEl.value.clientWidth;
			const scrollPercentage = (e.clientX - trackRect.left - startOffsetX) / (trackRect.width - thumbWidth);
			scrollerEl.value.scrollLeft = scrollWidth * scrollPercentage;
		}

		function onThumbHorizontalUp() {
			draggingHorizontal.value = false;
			readyToHideHorizontal();
			document.removeEventListener("pointermove", changeValue);
			document.removeEventListener("lostpointercapture", onThumbHorizontalUp);
			document.removeEventListener("pointerup", onThumbHorizontalUp);
		}

		document.addEventListener("pointermove", changeValue);
		document.addEventListener("lostpointercapture", onThumbHorizontalUp);
		document.addEventListener("pointerup", onThumbHorizontalUp);
	}

	/**
	 * 点击垂直轨道时滚动到对应位置，仅在鼠标操作时生效。
	 * @param e - 指针事件。
	 */
	function onTrackVerticalDown(e: PointerEvent) {
		if (!scrollerEl.value || !trackVertical.value || !thumbVertical.value || pointerType.value !== "mouse") return;

		const trackRect = trackVertical.value.getBoundingClientRect();
		const thumbRect = thumbVertical.value.getBoundingClientRect();

		/** 计算点击位置，并以 thumb 中心为基准 */
		const clickY = e.clientY - trackRect.top - thumbRect.height / 2;
		/** 限制范围 */
		const availableHeight = trackRect.height - thumbRect.height;
		const scrollPercentage = Math.min(1, Math.max(0, clickY / availableHeight));

		const scrollHeight = scrollerEl.value.scrollHeight - scrollerEl.value.clientHeight;
		scrollerEl.value.scrollTo({ top: scrollHeight * scrollPercentage, behavior: "smooth" });
	}

	/**
	 * 点击水平轨道时滚动到对应位置，仅在鼠标操作时生效。
	 * @param e - 指针事件。
	 */
	function onTrackHorizontalDown(e: PointerEvent) {
		if (!scrollerEl.value || !trackHorizontal.value || !thumbHorizontal.value || pointerType.value !== "mouse") return;

		const trackRect = trackHorizontal.value.getBoundingClientRect();
		const thumbRect = thumbHorizontal.value.getBoundingClientRect();

		/** 计算点击位置，并以 thumb 中心为基准 */
		const clickX = e.clientX - trackRect.left - thumbRect.width / 2;
		/** 限制范围 */
		const availableWidth = trackRect.width - thumbRect.width;
		const scrollPercentage = Math.min(1, Math.max(0, clickX / availableWidth));

		const scrollWidth = scrollerEl.value.scrollWidth - scrollerEl.value.clientWidth;
		scrollerEl.value.scrollTo({ left: scrollWidth * scrollPercentage, behavior: "smooth" });
	}

	onMounted(() => {
		if (!isMobile()) pointerType.value = "mouse";
		useResizeObserver(contentEl, onScrollChange);
	});
</script>

<template>
	<Comp
		:class="{
			dragging: draggingVertical || draggingHorizontal,
			touch: pointerType === 'touch',
			mouse: pointerType === 'mouse',
			'scrollable-both': scrollableVertical && scrollableHorizontal,
		}"
	>
		<div
			ref="scrollerEl"
			class="scroller"
			@scroll="onScrollChange"
			:style="{ overflowX: props.overflowX, overflowY: props.overflowY }"
		>
			<div ref="contentEl" class="content">
				<slot></slot>
			</div>
		</div>
		<div v-show="scrollableVertical" class="bar vertical" :class="{ show: showVertical, dragging: draggingVertical }">
			<div ref="trackVertical" class="track" @pointerdown="onTrackVerticalDown">
				<div
					ref="thumbVertical"
					class="thumb"
					:style="{
						height: `${thumbVerticalHeight}%`,
						top: `${thumbVerticalTop}%`,
						transform: `scaleX(${thumbVerticalScaleX})`,
					}"
					@pointerdown.stop="onThumbVerticalDown"
					@contextmenu.stop.prevent
					@touchstart.stop.prevent
				>
					<div class="inner"></div>
				</div>
			</div>
		</div>
		<div v-show="scrollableHorizontal" class="bar horizontal" :class="{ show: showHorizontal, dragging: draggingHorizontal }">
			<div ref="trackHorizontal" class="track" @pointerdown="onTrackHorizontalDown">
				<div
					ref="thumbHorizontal"
					class="thumb"
					:style="{
						width: `${thumbHorizontalWidth}%`,
						left: `${thumbHorizontalLeft}%`,
						transform: `scaleY(${thumbHorizontalScaleY})`,
					}"
					@pointerdown.stop="onThumbHorizontalDown"
					@contextmenu.stop.prevent
					@touchstart.stop.prevent
				>
					<div class="inner"></div>
				</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			--padding-top: 0;
			--padding-bottom: 0;
			--padding-left: 0;
			--padding-right: 0;
		}
	}

	:comp {
		position: relative;
	}

	.scroller {
		@include square(100%);
		padding: var(--padding-top) var(--padding-right) var(--padding-bottom) var(--padding-left);
		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}

		:comp.dragging &,
		:comp.dragging & * {
			cursor: default;
			pointer-events: none;
			user-select: none;
			touch-action: none;
		}
	}

	.bar {
		$touch-size: 9px;
		$touch-size-dragging: 14px;
		$mouse-size: 12px;
		$mouse-size-dragging: 16px;
		position: absolute;
		z-index: 29;
		opacity: 0;
		cursor: default;
		user-select: none;
		touch-action: none;

		&.vertical {
			top: var(--padding-top);
			right: var(--padding-right);
			bottom: var(--padding-bottom);

			:comp.touch & {
				width: $touch-size;

				&.dragging {
					width: $touch-size-dragging;
				}
			}

			:comp.mouse & {
				width: $mouse-size;

				&:any-hover,
				&.dragging {
					width: $mouse-size-dragging;
					opacity: 1;
				}
			}

			.thumb {
				width: 100%;
			}
		}

		&.horizontal {
			right: var(--padding-right);
			bottom: var(--padding-bottom);
			left: var(--padding-left);

			:comp.scrollable-both & {
				margin-right: $mouse-size-dragging;
			}

			:comp.touch & {
				height: $touch-size;

				&.dragging {
					height: $touch-size-dragging;
				}
			}

			:comp.mouse & {
				height: $mouse-size;

				&:any-hover,
				&.dragging {
					height: $mouse-size-dragging;
					opacity: 1;
				}
			}

			.thumb {
				height: 100%;
			}
		}

		&.vertical,
		&.horizontal {
			&:any-hover,
			&.dragging {
				:comp.mouse & .track {
					background-color: c(main-fg, 5%);
				}

				.thumb .inner {
					background-color: c(icon-color);
					backdrop-filter: blur(8px);
				}
			}
		}

		&.show {
			opacity: 1;
		}
	}

	.track {
		@include oval;
		@include square(100%);
		position: relative;
		transition: background-color 200ms;
	}

	.thumb {
		position: absolute;
		padding: 3px;
		transition: padding 200ms;

		:comp.mouse & {
			padding: 4px;
		}

		.inner {
			@include oval;
			width: 100%;
			height: 100%;
			background-color: c(icon-color, 60%);
			backdrop-filter: blur(8px);
		}
	}
</style>

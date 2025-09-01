<script setup lang="ts">
	const props = withDefaults(defineProps < {
		/** 滑块最小值。 */
		min?: number;
		/** 滑块最大值。 */
		max?: number;
		/** 滑块默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 */
		defaultValue?: number;
		/** 媒体缓冲加载进度百分比数组。 */
		buffered?: Buffered;
		/** 加载中。 */
		waiting?: boolean;
		/** 步长。 */
		step?: number;
		/**
		 * 显示待定值工具提示。
		 * - 如留空表示不显示。
		 * - 如为 `current` 表示显示滑块当前值。
		 * - 如为 `cursor` 表示显示光标所在位置的值。
		 */
		pending?: false | "current" | "cursor";
		/** 待定值工具提示的显示值，或将数值转换为显示值的函数。 */
		displayValue?: ((value: number) => Readable) | Readable;
	}>(), {
		min: 0,
		max: 100,
		defaultValue: undefined,
		buffered: undefined,
		waiting: false,
		step: undefined,
		pending: false,
		displayValue: undefined,
	});

	const emits = defineEmits<{
		/** 当滑块拖动时即触发事件。 */
		changing: [value: number, prevValue: number];
		/** 当滑块拖动完成抬起后才触发事件。 */
		changed: [value: number, prevValue: number];
	}>();

	const model = defineModel<number>({ required: true });
	const errorInfo = `取值范围应在 [${props.min}, ${props.max}] 其中，当前值为 ${model.value}。`;
	if (props.min > props.max)
		throw new RangeError(`Slider 的最小值比最大值要大？最小值为 ${props.min}，最大值为 ${props.max}。`);
	if (model.value < props.min)
		throw new RangeError("Slider 的值比最小值要小。" + errorInfo);
	if (model.value > props.max)
		throw new RangeError("Slider 的值比最大值要大。" + errorInfo);

	const restrict = (n: number | undefined, nanValue: number): number => {
		if (
			typeof props.min !== "number" ||
			typeof props.max !== "number" ||
			!Number.isFinite(props.min) ||
			!Number.isFinite(props.max)
		)
			return nanValue;

		return typeof n === "number" && Number.isFinite(n) ?
			clamp(map(n, props.min, props.max, 0, 1), 0, 1) :
			nanValue;
	};

	const value = computed(() => restrict(model.value, 0));
	const smoothValue = useSmoothValue(value, 0.5); // 修改这个参数可以调整滑动条的平滑移动值。
	const thumbEl = ref<HTMLDivElement>(), trackEl = ref<HTMLDivElement>();

	const showPendingState = ref<"" | "hovering" | "dragging">("");
	const pendingValue = ref(0);
	const smoothPendingValue = useSmoothValue(pendingValue, 0.5);

	/**
	 * 根据步长取整值。
	 * @param value - 要取整的值。
	 * @param step - 步长。
	 * @returns 如已指定步长则返回根据步长取整后的值，反之则返回原值。
	 */
	function roundToStep(value: number, step: number | undefined): number {
		return step ? Math.round(value / step) * step : value;
	}

	/**
	 * 重置默认值。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function resetToDefault(e: PointerEvent | MouseEvent) {
		e.preventDefault();
		if (props.defaultValue !== undefined && Number.isFinite(props.defaultValue)) {
			for (const event of ["update:modelValue", "changing", "changed"] as const)
				emits(event as "changing", props.defaultValue, model.value);
			if (props.pending === "current")
				pendingValue.value = props.defaultValue;
		}
	}

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 * @param lastValueIfTriggerByTrack - 是否是由点击轨道而转移过来调用的？如果是，则提供其上一次的值。
	 */
	function onThumbDown(e: PointerEvent, lastValueIfTriggerByTrack?: number) {
		if (e.button === 1) { resetToDefault(e); return; }
		const thumb = thumbEl.value!, track = trackEl.value!;
		const thumbSize = thumb.offsetWidth;
		const { left, width: max } = track.getBoundingClientRect();
		const x = lastValueIfTriggerByTrack !== undefined ? thumbSize / 2 : e.pageX - left - thumb.offsetLeft;
		const lastValue = lastValueIfTriggerByTrack ?? model.value;
		pendingValue.value = value.value;
		showPendingState.value = "dragging";
		const pointerMove = (e: PointerEvent) => { // useDebounce会造成「卡碟」，因此已去除
			const position = clamp(e.pageX - left - x, 0, max - thumbSize);
			const value = map(position, 0, max - thumbSize, props.min, props.max);
			const steppedValue = roundToStep(value, props.step);
			const lastValue = model.value;
			model.value = steppedValue;
			pendingValue.value = map(steppedValue, props.min, props.max, 0, 1);
			emits("changing", value, lastValue);
		};
		const pointerUp = (e: PointerEvent) => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			showPendingState.value = isInPath(e, track.parentElement) ? "hovering" : "";
			emits("changed", model.value, lastValue);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 获取指针在轨道上的值，供点击轨道和悬浮轨道一起使用。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 * @returns 指针在轨道上的值。
	 */
	function getPointerOnTrackValue(e: PointerEvent) {
		const thumb = thumbEl.value, track = trackEl.value;
		if (!thumb || !track) return props.min;
		const thumbSizeHalf = thumb.offsetWidth / 2;
		const { width } = track.getBoundingClientRect();
		return clamp(props.min, map(e.offsetX, thumbSizeHalf, width - thumbSizeHalf, props.min, props.max), props.max);
	}

	/**
	 * 点击轨道逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	async function onTrackDown(e: PointerEvent) {
		if (e.button === 1) { resetToDefault(e); return; }
		const value = getPointerOnTrackValue(e);
		const steppedValue = roundToStep(value, props.step);
		const lastValue = model.value;
		model.value = steppedValue;
		emits("changing", steppedValue, lastValue);
		await nextTick();
		onThumbDown(e, lastValue); // 再去调用拖拽滑块的事件。
	}

	/**
	 * 悬浮轨道逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onTrackMove(e: PointerEvent) {
		if (isInPath(e, thumbEl)) return;
		if (showPendingState.value === "")
			showPendingState.value = "hovering";
		if (showPendingState.value === "hovering")
			pendingValue.value = props.pending === "cursor" ? map(getPointerOnTrackValue(e), props.min, props.max, 0, 1) : value.value;
	}

	/**
	 * 离开轨道逻辑处理。
	 * @param _e - 指针事件（包括鼠标和触摸）。
	 */
	function onTrackLeave(_e: PointerEvent) {
		if (showPendingState.value === "hovering")
			showPendingState.value = ""; // TODO: 如果鼠标悬浮在滑块上，则会识别为离开轨道，视觉体验会有一个缩放的跳动，效果略差待修复。
	}

	/**
	 * 进入滑块逻辑处理。
	 * @param _e - 指针事件（包括鼠标和触摸）。
	 */
	function onThumbEnter(_e: PointerEvent) {
		if (showPendingState.value === "")
			showPendingState.value = "hovering";
		pendingValue.value = value.value;
	}

	/**
	 * 当手机端长按时（相当于电脑右键菜单），恢复默认值。
	 * @param e - 鼠标事件。
	 */
	function onLongPress(e: MouseEvent) {
		if (!isMobile()) return; // 电脑端则忽略。
		resetToDefault(e);
	}

	const displayValue = computed(() =>
		(typeof props.displayValue === "function" ? props.displayValue(pendingValue.value) : props.displayValue) ??
		map(pendingValue.value, 0, 1, props.min, props.max));
</script>

<template>
	<Comp
		tabindex="0"
		:style="{
			'--value': smoothValue,
			'--pending': smoothPendingValue,
		}"
		role="slider"
		:aria-valuenow="value"
		:aria-valuemin="min"
		:aria-valuemax="max"
		aria-orientation="horizontal"
	>
		<div
			ref="trackEl"
			class="track"
			@pointerdown="onTrackDown"
			@contextmenu="onLongPress"
			@pointermove="onTrackMove"
			@pointerleave="onTrackLeave"
		>
			<div class="base"></div>
			<div v-if="buffered && buffered.length > 0" class="buffered-container">
				<div
					v-for="([start, end], index) in buffered"
					class="buffered"
					:key="index"
					:style="{
						left: start <= 0.001 ? '0' : `calc((100% - var(--thumb-size)) * ${start} + var(--thumb-size))`,
						width: start <= 0.001 ? `calc((100% - var(--thumb-size)) * ${end - start} + var(--thumb-size))` : `calc((100% - var(--thumb-size)) * ${end - start})`,
					}"
				></div>
			</div>
			<div class="passed"></div>
			<div
				ref="thumbEl"
				class="thumb"
				:class="{ waiting }"
				@pointerdown.stop="onThumbDown"
				@contextmenu="onLongPress"
				@pointerenter="onThumbEnter"
			></div>
			<Transition v-if="pending">
				<div v-show="showPendingState" class="tooltip">{{ displayValue }}</div>
			</Transition>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 16px;
	$thumb-size-half: calc(var(--thumb-size) / 2);
	$track-thickness: 6px;
	$track-hit-thickness: 36px; // 反应区
	$value: calc(var(--value) * (100% - var(--thumb-size)));
	$pending: calc(var(--pending) * (100% - var(--thumb-size)) + var(--thumb-size) / 2);

	$large-track-thickness: 16px;
	$large-thumb-size: 24px;

	@layer props {
		/// 滑动条尺寸，可选的值为：small | large。
		--size: small;
	}

	:comp {
		--value: 0;
		--pending: -10086;
		--track-hit-thickness: #{$track-hit-thickness};
		position: relative;
		height: var(--track-hit-thickness);
		touch-action: none;

		> * {
			--thumb-size: #{$thumb-size};
			--track-thickness: #{$track-thickness};

			@container style(--size: large) {
				--thumb-size: #{$large-thumb-size};
				--track-thickness: #{$large-track-thickness};
			}
		}
	}

	/// 实际可点击区域
	.track {
		position: absolute;
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.base,
	.passed,
	.buffered-container,
	.buffered {
		@include oval;
		position: absolute;
		height: var(--track-thickness);

		&:not(.buffered) {
			margin: $thumb-size-half 0;
		}
	}

	.base {
		width: 100%;
		background-color: c(main-fg, 7%);
	}

	.passed,
	.buffered-container,
	.buffered {
		pointer-events: none;
		transition: none;
	}

	.passed {
		width: calc($value + $thumb-size);
		background-color: c(accent);
		opacity: map(var(--value), 0, 1, 0.4, 1, true);
	}

	.buffered-container {
		width: 100%;
		overflow: clip;
	}

	.buffered {
		background-color: c(accent-disabled);
	}

	.thumb {
		@include square(var(--thumb-size));
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc(var(--track-thickness) / 2 + var(--thumb-size-half));
		left: $value;
		background-color: c(main-bg);
		cursor: pointer;
		transition: $fallback-transitions, left 0s;

		@include tablet { // 增大移动端大小以便拖拽。
			&::before {
				@include square(var(--track-hit-thickness));
				@include circle;
				content: "";
				position: absolute;
			}
		}

		&::after {
			@include square(100%);
			@include circle;
			content: "";
			display: block;
			background-color: c(accent);
			scale: 0.5;
			transition: $fallback-transitions, scale $ease-out-back 250ms;
		}

		&:any-hover::after {
			scale: 0.7;
		}

		.track:active ~ &::after,
		&:active::after {
			scale: 0.4 !important;
		}

		&.waiting::after {
			animation: breathe calc(2s / 3) linear alternate infinite; // 这里呼吸动画的速度对应了 ProgressRing。
		}

		@container style(--size: large) {
			&::after {
				scale: 0.625;
			}

			&:any-hover::after {
				scale: 0.765;
			}
		}

		:comp:any-hover &,
		:comp:focus-visible & {
			@include control-ball-shadow-hover;
		}
	}

	.tooltip {
		@include round-small;
		position: absolute;
		left: $pending;
		flex-shrink: 0;
		padding: 8px;
		color: white;
		font-weight: 500;
		background-color: c(accent);
		transform-origin: center calc(100% + 8px);
		translate: -50% calc(-100% - 4px);
		filter: drop-shadow(0 1px 6px c(accent, 80%));
		cursor: pointer;
		pointer-events: none;
		transition: none;

		/// 底部三角
		&::after {
			@include square(16px);
			content: "";
			position: absolute;
			bottom: -4px;
			left: 50%;
			z-index: -1;
			background-color: inherit;
			border-radius: 2px;
			translate: -50% 0;
			rotate: 45deg;
		}

		&.v-enter-active {
			transition: scale $ease-out-expo 250ms;
		}

		&.v-leave-active {
			transition: scale $ease-in-expo 250ms;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 0;
		}
	}
</style>

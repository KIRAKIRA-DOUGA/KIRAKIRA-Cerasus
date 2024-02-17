<script setup lang="ts">
	const props = withDefaults(defineProps < {
		/** 滑块最小值。 */
		min?: number;
		/** 滑块最大值。 */
		max?: number;
		/** 滑块默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 */
		defaultValue?: number;
		/** 媒体缓冲加载进度值。 */
		buffered?: number;
	}>(), {
		min: 0,
		max: 100,
		defaultValue: undefined,
		buffered: undefined,
	});

	const emits = defineEmits<{
		/** 当滑块拖动时即触发事件。 */
		changing: [value: number];
		/** 当滑块拖动完成抬起后才触发事件。 */
		changed: [value: number];
	}>();

	const model = defineModel<number>({ required: true });
	const errorInfo = `取值范围应在 [${props.min}, ${props.max}] 其中，当前值为 ${model.value}。`;
	if (props.min > props.max)
		throw new RangeError(`Slider 的最小值比最大值要大？最小值为 ${props.min}，最大值为 ${props.max}。`);
	if (model.value < props.min)
		throw new RangeError("Slider 的值比最小值要小。" + errorInfo);
	if (model.value > props.max)
		throw new RangeError("Slider 的值比最大值要大。" + errorInfo);

	const restrict = (n: number | undefined, nanValue: number) => Number.isFinite(n) ? clamp(map(n!, props.min, props.max, 0, 1), 0, 1) : nanValue;
	const value = computed(() => restrict(model.value, 0));
	const smoothValue = useSmoothValue(value, 0.5); // 修改这个参数可以调整滑动条的平滑移动值。
	const buffered = computed(() => restrict(props.buffered, NaN));
	const thumbEl = ref<HTMLDivElement>(), trackEl = ref<HTMLDivElement>();

	/**
	 * 重置默认值。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function resetDefault(e: PointerEvent | MouseEvent) {
		e.preventDefault();
		if (props.defaultValue !== undefined && Number.isFinite(props.defaultValue))
			for (const event of ["update:modelValue", "changing", "changed"] as const)
				emits(event as "changing", props.defaultValue);
	}

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 * @param triggerByTrack - 是否是由点击轨道而转移过来调用的。
	 */
	function onThumbDown(e: PointerEvent, triggerByTrack: boolean = false) {
		if (e.button === 1) { resetDefault(e); return; }
		const thumb = thumbEl.value!, track = trackEl.value!;
		const thumbSize = thumb.offsetWidth;
		const { left, width: max } = track.getBoundingClientRect();
		const x = triggerByTrack ? 0 : e.pageX - left - thumb.offsetLeft;
		const pointerMove = useDebounce((e: PointerEvent) => {
			const position = clamp(e.pageX - left - x, 0, max - thumbSize);
			const value = map(position, 0, max - thumbSize, props.min, props.max);
			model.value = value;
			emits("changing", value);
		});
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			emits("changed", model.value);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 点击轨道逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	async function onTrackDown(e: PointerEvent) {
		if (e.button === 1) { resetDefault(e); return; }
		const thumb = thumbEl.value!, track = trackEl.value!;
		const thumbSizeHalf = thumb.offsetWidth / 2;
		const { width } = track.getBoundingClientRect();
		const value = map(e.offsetX, thumbSizeHalf, width - thumbSizeHalf, props.min, props.max);
		model.value = value;
		emits("changing", value);
		await nextTick();
		onThumbDown(e, true); // 再去调用拖拽滑块的事件。
	}

	/**
	 * 当手机端长按时（相当于电脑右键菜单），恢复默认值。
	 * @param e - 鼠标事件。
	 */
	function onLongPress(e: MouseEvent) {
		if (!isMobile()) return; // 电脑端则忽略。
		resetDefault(e);
	}
</script>

<template>
	<Comp
		tabindex="0"
		:style="{
			'--value': smoothValue,
			'--buffered': buffered,
		}"
		role="slider"
		:aria-valuenow="value"
		:aria-valuemin="min"
		:aria-valuemax="max"
		aria-orientation="horizontal"
	>
		<Contents>
			<div ref="trackEl" class="track" @pointerdown="onTrackDown" @contextmenu="onLongPress"></div>
			<div v-show="Number.isFinite(buffered)" class="buffered"></div>
			<div class="passed"></div>
			<div ref="thumbEl" class="thumb" @pointerdown="onThumbDown" @contextmenu="onLongPress"></div>
		</Contents>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 16px;
	$thumb-size-half: calc(var(--thumb-size) / 2);
	$track-thickness: 6px;
	$value: calc(var(--value) * (100% - var(--thumb-size)));
	$buffered: calc(var(--buffered) * (100% - var(--thumb-size)));

	$large-track-thickness: 16px;
	$large-thumb-size: 24px;

	@layer props {
		/// 滑动条尺寸，可选的值为：small | large。
		--size: small;
	}

	:comp {
		--value: 0;
		--buffered: 0;
		position: relative;
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

	.track,
	.passed,
	.buffered {
		@include oval;
		height: var(--track-thickness);
		margin: $thumb-size-half 0;
	}

	.track {
		background-color: c(gray-20);
		cursor: pointer;
	}

	.passed,
	.buffered {
		position: absolute;
		top: 0;
		margin-top: 0;
		transition: none;
		pointer-events: none;
	}

	.passed {
		width: calc($value + $thumb-size);
		background-color: c(accent);
		opacity: map(var(--value), 0, 1, 0.4, 1, true);
	}

	.buffered {
		width: $buffered;
		background-color: c(accent-disabled);
	}

	.thumb {
		@include square(var(--thumb-size));
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc(var(--track-thickness) / 2 - $thumb-size-half);
		left: $value;
		background-color: c(main-bg);
		cursor: pointer;
		transition: $fallback-transitions, left 0s;

		@include tablet { // 增加移动端大小以便拖拽。
			&::before {
				@include square(36px);
				@include circle;
				position: absolute;
				content: "";
			}
		}

		&::after {
			@include square(100%);
			@include circle;
			display: block;
			background-color: c(accent);
			transition: $fallback-transitions, scale $ease-out-back 250ms;
			content: "";
			scale: 0.5;
		}

		&:any-hover::after {
			scale: 0.7;
		}

		.track:active ~ &::after,
		&:active::after {
			scale: 0.4 !important;
		}

		@container style(--size: large) {
			&::after {
				scale: 0.625;
			}

			&:any-hover::after {
				scale: 0.765;
			}
		}

		:comp:focus & {
			@include large-shadow-focus;
		}
	}
</style>

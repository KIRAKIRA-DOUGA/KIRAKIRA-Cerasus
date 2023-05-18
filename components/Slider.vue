<script setup lang="ts">
	const props = withDefaults(defineProps<{
		modelValue: number;
		min?: number;
		max?: number;
		defaultValue?: number;
	}>(), {
		min: 0,
		max: 100,
		defaultValue: undefined,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: number): void;
		/** 当滑块拖动时即触发事件。 */
		(event: "changing", value: number): void;
		/** 当滑块拖动完成抬起后才触发事件。 */
		(event: "changed", value: number): void;
	}>();

	const errorInfo = `取值范围应在 [${props.min}, ${props.max}] 其中，当前值为 ${props.modelValue}。`;
	if (props.min > props.max)
		throw new RangeError(`Slider 的最小值比最大值要大？最小值为 ${props.min}，最大值为 ${props.max}。`);
	if (props.modelValue < props.min)
		throw new RangeError("Slider 的值比最小值要小。" + errorInfo);
	if (props.modelValue > props.max)
		throw new RangeError("Slider 的值比最大值要大。" + errorInfo);

	const value = computed(() => map(props.modelValue, props.min, props.max, 0, 1));
	const moveTransition = ref(false);

	/**
	 * 在短暂的一瞬间恢复动画。
	 */
	function quickMoveTransition() {
		moveTransition.value = true;
		setTimeout(() => moveTransition.value = false, 250);
	}

	/**
	 * 重置默认值。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function resetDefault(e: PointerEvent | MouseEvent) {
		e.preventDefault();
		quickMoveTransition();
		if (props.defaultValue !== undefined && Number.isFinite(props.defaultValue))
			for (const event of ["update:modelValue", "changing", "changed"] as const)
				emits(event as "update:modelValue", props.defaultValue);
	}

	// TODO: [兰音] 拖拽逻辑需要整改，改为识别按下轨道的位置，比识别按下滑块的位置更方便处理。
	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onThumbDown(e: PointerEvent) {
		if (e.button === 1) { resetDefault(e); return; }
		const thumb = (e.target as HTMLDivElement).parentElement!.querySelector(".thumb") as HTMLDivElement;
		const track = thumb.parentElement!.querySelector(".track")!;
		const { left, width: max } = track.getClientRects()[0];
		const x = e.pageX - left - thumb.offsetLeft;
		const pointerMove = (e: PointerEvent) => {
			const position = clamp(e.pageX - left - x, 0, max);
			const value = map(position, 0, max, props.min, props.max);
			emits("update:modelValue", value);
			emits("changing", value);
		};
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			emits("changed", props.modelValue);
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
		const track = e.target as HTMLDivElement;
		const { width } = track.getClientRects()[0];
		const value = map(e.offsetX, 0, width, props.min, props.max);
		emits("update:modelValue", value);
		emits("changing", value);
		await nextTick();
		onThumbDown(e); // 再去调用拖拽滑块的事件。
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
	<Comp :class="{ 'move-transition': moveTransition }" tabindex="0" :style="{ '--value': value }">
		<div class="track" @pointerdown="onTrackDown" @contextmenu="onLongPress"></div>
		<div class="passed"></div>
		<div class="thumb" @pointerdown="onThumbDown" @contextmenu="onLongPress"></div>
	</Comp>
</template>

<style scoped lang="scss">
	$thumb-size: 16px;
	$thumb-size-half: calc($thumb-size / 2);
	$track-thickness: 6px;
	$value: calc(var(--value) * (100% - $thumb-size));

	:comp {
		--value: 0;
		position: relative;
		touch-action: pan-y pinch-zoom;
	}

	.track,
	.passed {
		@include oval;
		height: $track-thickness;
		margin: $thumb-size-half;
	}

	.track {
		background-color: c(gray-30);
		cursor: pointer;
	}

	.passed {
		position: absolute;
		top: 0;
		width: $value;
		margin-top: 0;
		background-color: c(accent);
		opacity: map(var(--value), 0, 1, 0.4, 1, true);
		pointer-events: none;

		:comp:not(.move-transition) & {
			transition: none; // 关掉，关掉动画，一定要关掉。否则动画会卡到你怀疑人生。
		}
	}

	.thumb {
		@include square($thumb-size);
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc($track-thickness / 2 - $thumb-size-half);
		left: $value;
		background-color: c(main-bg);
		cursor: pointer;

		:comp:not(.move-transition) & {
			transition: $fallback-transitions, left 0ms;
		}

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
			transition: $fallback-transitions;
			content: "";
			scale: 0.5;
		}

		&:hover::after {
			scale: 0.7;
		}

		.track:active ~ &::after,
		&:active::after {
			scale: 0.4;
		}

		:comp:focus & {
			@include large-shadow-focus;
		}
	}
</style>

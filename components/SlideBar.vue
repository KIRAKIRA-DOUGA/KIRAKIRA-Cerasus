<script setup lang="ts">
	const props = withDefaults(defineProps<{
		modelValue: number;
		min?: number;
		max?: number;
	}>(), {
		min: 0,
		max: 100,
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
		throw new RangeError(`SlideBar 的最小值比最大值要大？最小值为 ${props.min}，最大值为 ${props.max}。`);
	if (props.modelValue < props.min)
		throw new RangeError("SlideBar 的值比最小值要小。" + errorInfo);
	if (props.modelValue > props.max)
		throw new RangeError("SlideBar 的值比最大值要大。" + errorInfo);

	const value = computed(() => map(props.modelValue, props.min, props.max, 0, 1));

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onThumbDown(e: PointerEvent) {
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
		const pointerUp = () => { // BUG: 触摸屏抬起事件有点问题。
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
		const track = e.target as HTMLDivElement;
		const { width } = track.getClientRects()[0];
		const value = map(e.offsetX, 0, width, props.min, props.max);
		emits("update:modelValue", value);
		await nextTick();
		onThumbDown(e); // 再去调用拖拽滑块的事件。
	}
</script>

<template>
	<kira-component class="slide-bar" tabindex="0" :style="{ '--value': value }">
		<div class="track" @pointerdown="onTrackDown"></div>
		<div class="passed"></div>
		<div class="thumb" @pointerdown="onThumbDown"></div>
	</kira-component>
</template>

<style scoped lang="scss">
	$thumb-size: 16px;
	$thumb-size-half: calc($thumb-size / 2);
	$track-thickness: 6px;
	$value: calc(var(--value) * (100% - $thumb-size));

	.slide-bar {
		--value: 0;
		position: relative;
	}

	.track,
	.passed {
		@include oval;
		height: $track-thickness;
		margin: $thumb-size-half;
	}

	.track {
		background-color: c(accent-disabled);
		cursor: pointer;
	}

	.passed {
		position: absolute;
		top: 0;
		width: $value;
		margin-top: 0;
		background-color: c(accent);
		opacity: map(var(--value), 0, 1, 0.4, 1, true);
		transition: none; // 关掉，关掉动画，一定要关掉。否则动画会卡到你怀疑人生。
		pointer-events: none;
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
		transition: $fallback-transitions, left 0ms;

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

		slide-bar:focus & {
			@include large-shadow-focus;
		}
	}
</style>

<docs>
	# 胶囊滑动条
	适用于音量、速度控制。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 滑块最小值。 */
		min?: number;
		/** 滑块最大值。 */
		max?: number;
		/** 滑块默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 */
		defaultValue?: number;
		/** 显示值，或将数值转换为显示值的函数。 */
		displayValue?: ((value: number) => Readable) | Readable;
	}>(), {
		min: 0,
		max: 100,
		defaultValue: undefined,
		displayValue: undefined,
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
		throw new RangeError(`CapsuleSlider 的最小值比最大值要大？最小值为 ${props.min}，最大值为 ${props.max}。`);
	if (model.value < props.min)
		throw new RangeError("CapsuleSlider 的值比最小值要小。" + errorInfo);
	if (model.value > props.max)
		throw new RangeError("CapsuleSlider 的值比最大值要大。" + errorInfo);

	const restrict = (n: number | undefined, nanValue: number) => Number.isFinite(n) ? clamp(map(n!, props.min, props.max, 0, 1), 0, 1) : nanValue;
	const value = computed(() => restrict(model.value, 0));
	const smoothValue = useSmoothValue(value, 0.5); // 修改这个参数可以调整滑动条的平滑移动值。
	const adjustedValue = computed(() => { // 由于 clip-path 造成视觉上的白边，因此对数值进行小幅调整。
		const TINY = 0.005;
		return (1 - smoothValue.value) * (1 + TINY) - TINY;
	});

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
	 * 点击轨道逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onTrackDown(e: PointerEvent) {
		if (e.button === 1) { resetDefault(e); return; }
		const track = e.currentTarget as HTMLDivElement;
		const { left, width: max } = track.getBoundingClientRect();
		const pointerMove = (e: PointerEvent) => {
			const position = clamp(e.pageX - left, 0, max);
			const value = map(position, 0, max, props.min, props.max);
			model.value = value;
			emits("changing", value);
		};
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			emits("changed", model.value);
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
		pointerMove(e);
	}

	/**
	 * 当手机端长按时（相当于电脑右键菜单），恢复默认值。
	 * @param e - 鼠标事件。
	 */
	function onLongPress(e: MouseEvent) {
		if (!isMobile()) return; // 电脑端则忽略。
		resetDefault(e);
	}

	const displayValue = computed(() =>
		(typeof props.displayValue === "function" ? props.displayValue(model.value) : props.displayValue)
		?? model.value);
</script>

<template>
	<Comp
		tabindex="0"
		:style="{ '--value': smoothValue }"
		role="slider"
		:aria-valuenow="value"
		:aria-valuemin="min"
		:aria-valuemax="max"
		aria-orientation="horizontal"
	>
		<div class="track" @pointerdown="onTrackDown" @contextmenu="onLongPress">
			<div class="value-container">
				<div class="value">{{ displayValue }}</div>
				<div class="value passed"></div>
				<div class="value value-on">{{ displayValue }}</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$track-thickness: 32px;

	:comp {
		--value: 0;
		position: relative;
		touch-action: none;
	}

	.track {
		@include round-large;
		@include dropdown-flyouts;
		position: relative;
		width: 100%;
		height: $track-thickness;
		margin: 0;
		overflow: hidden;
		background-color: c(acrylic-bg, 75%);
		cursor: pointer;
	}

	.value-container {
		position: relative;
		height: 100%;
	}

	.value {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		padding-left: 20px;
		color: c(accent);
		transition: none;
		pointer-events: none;

		html.dark & {
			color: white;
		}
	}

	.passed {
		background-color: c(accent);
		opacity: map(var(--value), 0, 1, 0.4, 1, true);
	}

	.passed,
	.value-on {
		color: white;
		clip-path: inset(-1rem calc(v-bind(adjustedValue) * 100%) -1rem -1rem);
	}
</style>

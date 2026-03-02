<script lang="ts">
	const KEY_PERCENT = [0, 50, 100] as const;
	const childrenStates = ["hover", "pressed"] as const;
	const POINTER_MOVE_THRESHOLD = 5;

	function withShiftKey([x, y]: TwoD, [oldX, oldY]: TwoD, shiftKey: boolean): TwoD {
		if (!shiftKey) return [x, y];
		else if (Math.abs(y - oldY) <= Math.abs(x - oldX)) return [x, oldY];
		else return [oldX, y];
	}
</script>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 位置值。 */
		value: TwoD;
		/** 禁用？ */
		disabled?: boolean;
		/** 默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 @default [50, 50] */
		defaultValue?: TwoD;
	}>(), {
		disabled: false,
		defaultValue: () => [50, 50],
	});

	const emits = defineEmits<{
		/** 当拖动滑块时触发。 */
		changing: [value: TwoD];
		/** 当滑块被拖动后抬起时触发。 */
		changed: [value: TwoD];
	}>();

	const thumbEl = ref<HTMLDivElement>(), buttonsEl = ref<HTMLDivElement>();
	const lastPointerAction = ref<"move" | "down" | "down move" | "up">("up");
	const _valueRef = toRef(() => props.value); // smoothValue 需要接受一个 ref 类型的参数，必须先将 prop 转换为 ref。
	const smoothValue = useSmoothValue(_valueRef, 0.5);

	const getHoveredElements = (e: PointerEvent) => document.elementsFromPoint(e.pageX, e.pageY);

	const setChildrenState = (targetElements: Element[], state: typeof childrenStates[number]) => {
		if (!buttonsEl.value || !thumbEl.value) return;
		[thumbEl.value, ...buttonsEl.value.children].forEach(el => childrenStates.forEach(curState =>
			el.classList.toggle(curState, state !== curState ? false : targetElements.includes(el))));
	};

	const handlePointerLeave = () => setChildrenState([], "hover");

	const handlePointerMove = (e: PointerEvent) => {
		if (["down", "down move"].includes(lastPointerAction.value)) return;
		lastPointerAction.value = "move";
		const hoveredElements = !e.buttons ? getHoveredElements(e) : [];
		setChildrenState(hoveredElements, "hover");
	};

	const handlePointerDown = (e: PointerEvent) => {
		if (e.button) { e.preventDefault(); return; }
		const thumb = thumbEl.value, target = e.currentTarget as HTMLDivElement, buttons = buttonsEl.value;
		if (!thumb || !buttons) return;
		const thumbRadius = thumb.clientWidth / 2;
		const targetLeft = buttons.offsetLeft + thumbRadius,
			targetTop = buttons.offsetTop + thumbRadius,
			targetRight = buttons.offsetLeft + buttons.offsetWidth - thumbRadius,
			targetBottom = buttons.offsetTop + buttons.offsetHeight - thumbRadius;
		lastPointerAction.value = "down";
		const hoveredElements = getHoveredElements(e);
		setChildrenState(hoveredElements, "pressed");
		const aborter = new AbortController();
		target.setPointerCapture(e.pointerId);
		const eDown = e, oldValue = props.value;
		let lastPointerMoveEvent: PointerEvent;
		let changingValue: TwoD | undefined;
		const pointerMove = useDebounce((e?: PointerEvent, shiftKey?: boolean) => {
			if (e) lastPointerMoveEvent = e;
			e ??= lastPointerMoveEvent;
			if (lastPointerAction.value === "down" && Math.hypot(e.pageX - eDown.pageX, e.pageY - eDown.pageY) <= POINTER_MOVE_THRESHOLD || !lastPointerAction.value.includes("down")) return;
			lastPointerAction.value = "down move";
			setChildrenState([thumb], "pressed");
			changingValue = withShiftKey([
				clampMap(e.offsetX, targetLeft, targetRight, 0, 100),
				clampMap(e.offsetY, targetTop, targetBottom, 0, 100),
			], oldValue, shiftKey ?? e.shiftKey);
			emits("changing", changingValue);
		});
		target.addEventListener("pointermove", pointerMove, { signal: aborter.signal });
		target.addEventListener("pointerup", () => {
			aborter.abort();
			target.releasePointerCapture(e.pointerId);
			if (changingValue) emits("changed", changingValue);
		}, { signal: aborter.signal });
		(["keydown", "keyup"] as const).forEach(type => window.addEventListener(type, e => {
			if (e.key === "Shift") pointerMove(undefined, type === "keydown");
		}, { signal: aborter.signal }));
	};

	const handlePointerUp = (e: PointerEvent) => {
		if (e.button) { e.preventDefault(); return; }
		handlePointerLeave();
		if (lastPointerAction.value === "down" && buttonsEl.value) {
			const hoveredElements = getHoveredElements(e);
			([...buttonsEl.value.children].find(el => hoveredElements.includes(el)) as HTMLButtonElement)?.click();
			setChildrenState(hoveredElements, "hover");
		}
		lastPointerAction.value = "up";
	};
</script>

<template>
	<Comp
		@pointermove="handlePointerMove"
		@pointerleave="handlePointerLeave"
		@pointerup="handlePointerUp"
		@pointerdown="handlePointerDown"
		@auxclick.prevent="emits('changed', defaultValue)"
		@contextmenu="stopEvent"
		:disabled="disabled || undefined"
	>
		<div ref="buttonsEl" class="buttons">
			<template v-for="y in KEY_PERCENT">
				<button v-for="x in KEY_PERCENT" :key="`${x}% ${y}%`" type="button" :tabIndex="-1" @click="emits('changed', [x, y])"></button>
			</template>
		</div>
		<div ref="thumbEl" class="thumb" :style="{ '--x': smoothValue[0], '--y': smoothValue[1] }"></div>
	</Comp>
</template>

<style scoped lang="scss">
	$button-size: 32px;
	$thumb-size: 16px;
	$thumb-move-offset: $button-size * 3 - 6px - $thumb-size;

	:comp {
		@include square($button-size * 3);
		@include round-large;
		@include control-inner-shadow;
		position: relative;
		direction: ltr;
		writing-mode: horizontal-tb;
		background-color: c(inset-bg);
		background-clip: padding-box;
		touch-action: none;

		&::after { // Intercept pointer events.
			content: "";
			position: absolute;
			inset: 0;
			display: block;
		}

		&[disabled] {
			opacity: 0.75;
			pointer-events: none;
			interactivity: inert;

			.thumb {
				box-shadow: none;
			}
		}
	}

	.thumb {
		@include square($thumb-size);
		@include circle;
		@include flex-center;
		@include control-ball-shadow;
		position: absolute;
		top: calc(2px + var(--y) / 100 * $thumb-move-offset);
		left: calc(2px + var(--x) / 100 * $thumb-move-offset);
		margin: 1px;
		background-color: c(main-bg);
		cursor: pointer;
		transition: $fallback-transitions, inset 0s;

		&::after {
			@include square(100%);
			@include circle;
			content: "";
			display: block;
			background-color: c(accent);
			scale: 0.5;
			transition: $fallback-transitions, scale $ease-out-back 250ms;
		}

		&.hover::after {
			scale: 0.7;
		}

		&.pressed::after {
			scale: 0.4 !important;
		}
	}

	.buttons {
		position: absolute;
		inset: 2px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;

		button {
			@include round-small;
			position: relative;
			border-radius: 4px;

			&::after {
				content: "";
				position: absolute;
				inset: -1px;
				display: block;
			}

			&.hover {
				background-color: c(hover-overlay);
			}

			&.pressed {
				background-color: c(ripple);
			}
		}
	}
</style>

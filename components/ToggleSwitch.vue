<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 打开。 */
		modelValue?: boolean;
		/** 打开，兼容使用。 */
		on?: boolean;
		/** 禁用。 */
		disabled?: boolean;
	}>(), {
		modelValue: undefined,
		disabled: false,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", on: boolean): void;
	}>();

	const isDraging = ref(false);

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onThumbDown(e: PointerEvent) {
		const thumb = e.target as HTMLDivElement;
		const control = thumb.parentElement!;
		const thumbWidth = thumb.getClientRects()[0].width;
		const controlRect = control.getClientRects()[0];
		const left = controlRect.left, max = controlRect.width - thumbWidth;
		const x = e.pageX - left - thumb.offsetLeft;
		const firstTime = new Date().getTime();
		const pointerMove = (e: PointerEvent) => {
			thumb.style.left = `${clamp(e.pageX - left - x, 0, max)}px`;
		};
		const pointerUp = (e: PointerEvent) => { // BUG: 触摸屏抬起事件有点问题。
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			const isOn = e.pageX - x > left + max / 2;
			emits("update:modelValue", isOn);
			thumb.style.removeProperty("left");
			const lastTime = new Date().getTime();
			isDraging.value = lastTime - firstTime > 200; // 定义识别为拖动而不是点击的时间差。
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 点击事件。为了和拖拽事件让位。
	 */
	function onClick() {
		if (!isDraging.value) emits("update:modelValue", !props.modelValue);
		isDraging.value = false;
	}
</script>

<template>
	<section :class="{ on: modelValue ?? on, disabled }" :tabindex="disabled ? -1 : 0" @click="onClick">
		<slot></slot>
		<div class="switch">
			<div class="base"></div>
			<div class="thumb" @pointerdown="onThumbDown"></div>
		</div>
	</section>
</template>

<style scoped lang="scss">
	section {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	$width: 34px;
	$base-height: 14px;
	$thumb-size: 20px;
	$focus-ring-thickness: 10px;

	.switch {
		position: relative;
		width: $width;
		height: $thumb-size;

		.base {
			@include oval;
			position: absolute;
			top: calc(($thumb-size - $base-height) / 2);
			width: $width;
			height: $base-height;
			background-color: c(gray-2);

			.on & {
				background-color: c(accent, 40%);
			}

			.disabled & {
				background-color: c(gray);
			}

			.on.disabled & {
				background-color: c(icon-color, 40%);
			}
		}

		.thumb {
			@include square($thumb-size);
			@include circle;
			@include control-ball-shadow-off;
			position: absolute;
			top: 0;
			left: 0;
			background-color: c(white);

			.on & {
				left: $width - $thumb-size;
			}

			.on:not(.disabled) & {
				@include control-ball-shadow;
				background-color: c(accent);
			}

			.disabled & {
				background-color: c(gray);
			}

			.on.disabled & {
				background-color: c(gray-2);
			}

			section:focus & {
				@include large-shadow-unchecked-focus;
			}

			section.on:focus & {
				@include large-shadow-focus;
			}

			section:active & {
				transform: scale(calc(19 / 20));
			}

			// TODO: 接下来请你编写 hover、pressed 样式。
		}
	}

	.disabled {
		pointer-events: none !important;
	}
</style>

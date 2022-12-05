<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 打开。 */
		on?: boolean;
		/** 禁用。 */
		disabled?: boolean;
	}>(), {
		on: false,
		disabled: false,
	});

	const emits = defineEmits<{
		(event: "update:on", on: boolean): void;
	}>();

	const isDraging = ref(false);

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 鼠标事件。
	 */
	function onThumbDown(e: MouseEvent) {
		const thumb = e.target as HTMLDivElement;
		const control = thumb.parentElement as HTMLDivElement;
		const thumbWidth = thumb.getClientRects()[0].width;
		const controlRect = control.getClientRects()[0];
		const left = controlRect.left, right = controlRect.right - thumbWidth;
		const x = e.pageX - left - thumb.offsetLeft;
		const firstTime = new Date().getTime();
		const mouseMove = (e: MouseEvent) => {
			thumb.style.left = `${clamp(e.pageX - x, left, right) - left}px`;
		};
		const mouseUp = (e: MouseEvent) => {
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", mouseUp);
			const center = (left + right) / 2;
			const isOn = e.pageX - x > center;
			emits("update:on", isOn);
			thumb.style.removeProperty("left");
			const lastTime = new Date().getTime();
			isDraging.value = lastTime - firstTime > 200; // 定义识别为拖动而不是点击的时间差。
		};
		document.addEventListener("mousemove", mouseMove);
		document.addEventListener("mouseup", mouseUp);
	}

	/**
	 * 点击事件。为了和拖拽事件让位。
	 * @param _ - 鼠标事件。
	 */
	function onClick(_: MouseEvent) {
		if (!isDraging.value) emits("update:on", !props.on);
		isDraging.value = false;
	}
</script>

<template>
	<div class="item" :class="{ on, disabled }" :tabindex="disabled ? -1 : 0" @click="onClick">
		<slot></slot>
		<div class="switch">
			<div class="base"></div>
			<div class="thumb" @mousedown="onThumbDown"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "assets/scss/theme";

	.item {
		display: flex;
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
			width: $width;
			height: $base-height;
			background-color: $light-mode-gray-2;
			position: absolute;
			top: calc(($thumb-size - $base-height) / 2);
			border-radius: 9999rem;

			.on & {
				background-color: #f06e8e61;
			}

			.disabled & {
				background-color: $light-mode-gray;
			}

			.on.disabled & {
				background-color: #afafaf61;
			}
		}

		.thumb {
			width: $thumb-size;
			height: $thumb-size;
			background-color: $light-mode-main-bg;
			box-shadow: 0 1px 6px #79717380;
			position: absolute;
			top: 0;
			border-radius: 100%;
			left: 0;

			.on & {
				left: $width - $thumb-size;
			}

			.on:not(.disabled) & {
				background-color: $brand-pink-50;
				box-shadow: 0 1px 6px #f06e8ecc;
			}

			.disabled & {
				background-color: $light-mode-gray;
			}

			.on.disabled & {
				background-color: $light-mode-gray-2;
			}

			.item:focus & {
				box-shadow: 0 1px 6px #79717380, 0 0 0 $focus-ring-thickness #cccccc80;
			}

			.item.on:focus & {
				box-shadow: 0 1px 6px #f06e8ecc, 0 0 0 $focus-ring-thickness #f8afb880;
			}

			.item:active & {
				transform: scale(calc(19 / 20));
			}

			// TODO: 目前缺少 hover 样式。
		}
	}

	.disabled {
		pointer-events: none !important;
	}
</style>

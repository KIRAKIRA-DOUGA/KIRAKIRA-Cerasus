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
	const on = computed(() => props.modelValue ?? props.on);
	const toggleSwitch = ref<HTMLElement>();

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
		const pointerUp = (e: PointerEvent) => {
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

	// 如果切换开关开启情况与 prop 不同，就强制使其相同。
	watch(() => toggleSwitch.value?.classList.contains("on"), () => {
		if (toggleSwitch.value && on.value !== toggleSwitch.value.classList.contains("on"))
			on.value ? toggleSwitch.value.classList.add("on") : toggleSwitch.value.classList.remove("on");
	}, { immediate: true });
</script>

<template>
	<kira-component ref="toggleSwitch" class="toggle-switch" :class="{ on, disabled }" :tabindex="disabled ? -1 : 0" @click="onClick">
		<slot></slot>
		<div class="switch">
			<div class="base"></div>
			<div class="thumb" @pointerdown="onThumbDown"></div>
		</div>
	</kira-component>
</template>

<style scoped lang="scss">
	$width: 34px;
	$base-height: 14px;
	$thumb-size: 20px;
	$focus-ring-thickness: 10px;
	$component-class: ".toggle-switch";

	#{$component-class} {
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
	}

	.switch {
		position: relative;
		width: $width;
		height: $thumb-size;
		touch-action: pan-y pinch-zoom;

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
				background-color: c(gray-2, 40%);
			}

			.on.disabled & {
				background-color: c(accent-disabled, 40%);
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
				@include control-ball-shadow-off-disabled;
				background-color: c(inner-color-85);
			}

			.on.disabled & {
				@include control-ball-shadow-disabled;
				background-color: c(accent-disabled);
			}

			#{$component-class}:focus & {
				@include large-shadow-unchecked-focus;
			}

			#{$component-class}.on:not(.disabled):focus & {
				@include large-shadow-focus;
			}

			#{$component-class}:active & {
				transform: scale(calc(19 / 20));
			}

			#{$component-class}.on:hover:not(:focus) & {
				@include control-ball-shadow-hover;
			}

			#{$component-class}:hover:not(:focus) & {
				@include control-ball-shadow-off-hover;
			}
		}
	}

	.disabled {
		pointer-events: none;

		.dark & .switch {
			opacity: 0.7;
		}

		.dark &.on .switch {
			opacity: 0.5; // 深色主题下颜色太鲜艳了，不容易分清是否被禁用。
		}
	}
</style>

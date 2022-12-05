<script setup lang="ts">
	const _props = withDefaults(defineProps<{
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
</script>

<template>
	<div class="item" :class="{ on, disabled }" :tabindex="disabled ? -1 : 0" @click="emits('update:on', !on)">
		<slot></slot>
		<div class="switch">
			<div class="track"></div>
			<div v-drag class="thumb"></div>
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
	$track-height: 14px;
	$thumb-size: 20px;
	$focus-ring-thickness: 10px;

	.switch {
		position: relative;
		width: $width;
		height: $thumb-size;

		.track {
			width: $width;
			height: $track-height;
			background-color: $light-mode-gray-2;
			position: absolute;
			top: calc(($thumb-size - $track-height) / 2);
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
		}
	}

	.disabled {
		pointer-events: none !important;
	}
</style>

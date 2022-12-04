<script setup lang="ts">
	const _props = withDefaults(defineProps<{
		on?: boolean;
		disabled?: boolean;
	}>(), {
		on: false,
		disabled: false,
	});

	const emits = defineEmits<{
		(event: "change", arg: { on: boolean }): void;
	}>();
</script>

<template>
	<div class="item" :class="{ on, disabled }" :tabindex="disabled ? -1 : 0" @click="emits('change', { on: !on })">
		<slot></slot>
		<div class="switch">
			<div class="track"></div>
			<div class="thumb"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "assets/scss/theme";

	.item {
		display: flex;
		justify-content: space-between;
	}

	.switch {
		position: relative;
		width: 34px;
		height: 20px;

		.track {
			width: 34px;
			height: 14px;
			background-color: $light-mode-gray-2;
			position: absolute;
			top: 3px;
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
			$size: 20px;
			width: $size;
			height: $size;
			background-color: $light-mode-main-bg;
			box-shadow: 0 1px 6px #79717380;
			position: absolute;
			top: 0;
			border-radius: 100%;
			left: 0;

			.on & {
				left: 14px;
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

			$focus-ring-size: 10px;

			.item:focus & {
				box-shadow: 0 1px 6px #79717380, 0 0 0 $focus-ring-size #cccccc80;
			}

			.item.on:focus & {
				box-shadow: 0 1px 6px #f06e8ecc, 0 0 0 $focus-ring-size #f8afb880;
			}
		}
	}

	.disabled {
		pointer-events: none !important;
	}
</style>

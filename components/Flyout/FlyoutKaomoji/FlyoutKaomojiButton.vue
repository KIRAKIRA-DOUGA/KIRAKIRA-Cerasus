<script setup lang="ts">
	const props = defineProps<{
		/** 使用更强烈的色调表示选中聚焦项。 */
		highlighted?: boolean;
	}>();
</script>

<template>
	<Button class="flyout-kaomoji-button" :class="{ highlighted }"><slot></slot></Button>
</template>

<style scoped lang="scss">
	button:comp {
		@include chip-shadow;
		@include radius-small;
		display: flex;
		height: 24px;
		color: c(text-color);
		background-color: c(main-bg);

		@media (any-hover: hover) {
			&:hover {
				@include button-shadow-unchecked-hover;
				background-color: c(gray-20);
			}

			&:hover:focus {
				@include button-shadow-unchecked-hover-focus;
			}
			
			&.highlighted:hover:focus {
				@include button-shadow-hover-focus;
				background-color: c(accent-hover);
			}
		}

		&:active {
			background-color: c(gray-20);
		}

		&:focus {
			@include button-shadow-unchecked-focus;
		}

		&.highlighted:focus {
			@include button-shadow-focus;
			color: white;
			background-color: c(accent);
		}

		&.highlighted:active:focus {
			background-color: c(accent);
		}
	}
	
	:where(button:comp) {
		width: 100%;
	}
</style>

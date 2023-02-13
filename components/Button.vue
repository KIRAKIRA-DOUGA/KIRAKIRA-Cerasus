<script setup lang="ts">
	const props = defineProps<{
		icon?: string;
		iconBehind?: boolean;
		secondary?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "click"): void;
	}>();
</script>

<template>
	<button v-ripple :class="{ secondary }" @click="emits('click')">
		<NuxtIcon v-if="icon && !iconBehind" :name="icon" class="icon" />
		<slot></slot>
		<NuxtIcon v-if="icon && iconBehind" :name="icon" class="icon" />
	</button>
</template>

<style scoped lang="scss">
	button {
		@include flex-center;
		@include button-shadow;
		@include radius-small;
		display: inline-flex;
		gap: 8px;
		min-height: 36px;
		padding: 8px 16px;
		color: white;
		font-size: inherit;
		letter-spacing: 0.05em;
		vertical-align: middle;
		background: c(accent);
		border: none;
		cursor: pointer;
		transition: $fallback-transitions, all $ease-out-back 250ms;
		appearance: none;

		&:hover {
			@include button-shadow-hover;
			background: c(accent-hover);
		}

		&:active {
			background: c(accent);
			box-shadow: none !important;
			scale: calc(35 / 36);
		}

		&[disabled] {
			background: c(accent-disabled);
			box-shadow: none !important;
			pointer-events: none;
		}

		&:focus {
			@include button-shadow-focus;
		}

		&:hover:focus {
			@include button-shadow-hover-focus;
		}

		&.secondary {
			color: c(accent);
			background: transparent;
			box-shadow: none !important;

			&:hover {
				background: c(accent-hover, 8%);
			}

			&:focus:not(:hover) { // TODO: focus 样式感觉要重制一下，和 hover 样式有些违和。
				background: c(accent-focus, 8%);
			}

			&[disabled] {
				color: c(accent-disabled);
			}
		}
	}

	.icon {
		color: white;
		font-size: 18px;
	}
</style>

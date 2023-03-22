<script setup lang="ts">
	const props = defineProps<{
		icon?: string;
		text?: string;
	}>();

	const emits = defineEmits<{
		(event: "click"): void;
	}>();
</script>

<template>
	<div class="button-wrapper">
		<button v-ripple type="button" @click="emits('click')">
			<NuxtIcon v-if="icon" :name="icon" class="icon" />
			<span v-if="text">{{ text }}</span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	.icon {
		color: c(icon-color);
		font-size: inherit;
	}

	.button-wrapper {
		@include flex-center;
		@include square(36px);
		@include circle;

		button {
			@include flex-center;
			@include square(64px);
			@include circle;
			flex-shrink: 0;
			color: c(icon-color);
			font-weight: 600;
			font-size: 24px;
			background: none;
			border: none;
			cursor: pointer;
			appearance: none;

			&:focus-visible {
				@include button-shadow-focus;
				@include square(40px);
			}

			&:hover {
				z-index: 1;
			}
		}
	}
</style>

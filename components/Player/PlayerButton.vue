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
	<button v-ripple @click="emits('click')">
		<NuxtIcon v-if="icon" :name="icon" class="icon" />
		<span v-if="text">{{ text }}</span>
	</button>
</template>

<style scoped lang="scss">
	.icon {
		color: c(icon-color);
		font-size: 24px;
	}

	button {
		@include flex-center;
		gap: 8px;
		height: 100%;
		padding: 0 8px;
		color: c(icon-color);
		font-weight: 600;
		font-size: 14px;
		background: none;
		border: none;
		cursor: pointer;
		appearance: none;

		&:focus-visible {
			@include button-shadow-focus;
		}
	}
</style>

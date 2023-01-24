<script setup lang="ts">
	import { NuxtLink } from "#components";

	const props = defineProps<{
		icon: string;
		to?: string;
	}>();

	const localePath = useLocalePath();
</script>

<template>
	<component :is="to ? NuxtLink : 'div'" :to="to && localePath(to)" class="button-wrapper">
		<div class="button">
			<NuxtIcon :name="icon" class="icon" />
		</div>
	</component>
</template>

<style scoped lang="scss">
	.button-wrapper {
		@include flex-center;
		width: 40px;
		background: none;
		border-radius: 50%;
		cursor: pointer;
	}

	.button {
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: c(icon-color);
		font-size: 24px;
		border-radius: 50%;
		user-select: none;

		.router-link-active & {
			color: c(accent);
		}
	}
</style>

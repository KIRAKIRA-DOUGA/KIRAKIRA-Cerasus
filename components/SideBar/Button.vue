<script setup lang="ts">
	const props = defineProps<{
		icon?: string;
		iconBehind?: boolean;
	}>();
</script>

<template>
	<div class="sidebar-button">
		<NuxtIcon v-if="icon" :name="icon" class="icon" />
	</div>
</template>

<style scoped lang="scss">
	.sidebar-button {
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
	}

	.router-link-active .sidebar-button {
		color: c(accent);
	}
</style>

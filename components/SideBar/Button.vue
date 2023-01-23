<script setup lang="ts">
	const props = defineProps<{
		icon: string;
		to?: string;
	}>();

	const localePath = useLocalePath();
</script>

<template>
	<NuxtLink v-if="to" :to="localePath(to)" class="sidebar-button-wrapper">
		<div class="sidebar-button">
			<NuxtIcon :name="icon" class="icon" />
		</div>
	</NuxtLink>

	<div v-else class="sidebar-button-wrapper">
		<div class="sidebar-button">
			<NuxtIcon :name="icon" class="icon" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.sidebar-button-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		background: none;
		border-radius: 50%;
		cursor: pointer;
	}

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

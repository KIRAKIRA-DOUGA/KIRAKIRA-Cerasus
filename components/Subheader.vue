<script setup lang="ts">
	const props = withDefaults(defineProps<{
		icon?: string;
		badge?: string | number;
	}>(), {
		icon: "apps",
		badge: undefined,
	});
</script>

<template>
	<section class="subheader">
		<NuxtIcon :name="icon" class="icon" />
		<div class="title">
			<slot></slot>
		</div>
		<Badge v-if="badge || badge === 0">
			{{ badge }}
		</Badge>
	</section>
</template>

<style scoped lang="scss">
	.subheader {
		@include flex-center;
		gap: 8px;
		justify-content: flex-start;
	}

	.title {
		color: c(accent);
		font-weight: bold;
		font-size: 16px;
	}

	.icon {
		color: c(accent);
		font-size: 20px;
	}
</style>

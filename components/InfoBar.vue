<script setup lang="ts">
	const props = withDefaults(defineProps<{
		title?: string;
		type?: "info" | "warning";
	}>(), {
		title: undefined,
		type: "info",
	});

	const icon = computed(() => ({
		info: "info",
		warning: "exclamation",
	}[props.type]));
</script>

<template>
	<Comp :class="{ 'force-color yellow': type === 'warning' }">
		<Icon :name="icon" />
		<div class="content">
			<p v-if="title" class="title">{{ title }}</p>
			<p><slot></slot></p>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include chip-shadow;
		display: flex;
		gap: 8px;
		padding: 16px;
		color: white;
		background-color: c(accent);
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.title {
		font-weight: bold;
		font-size: 16px;
	}

	.icon {
		font-size: 24px;
	}
</style>

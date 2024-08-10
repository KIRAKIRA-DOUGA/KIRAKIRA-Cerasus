<script setup lang="ts">
	const props = withDefaults(defineProps<{
		title?: string;
		type?: "info" | "warning";
		lite?: boolean;
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
	<Comp :class="{ 'force-color yellow': type === 'warning', lite }">
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

		&.lite {
			color: c(text-color);
			background-color: c(surface-color);
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.title {
		font-size: 16px;
		font-weight: bold;
	}

	.icon {
		font-size: 24px;
	}

	p {
		user-select: text;
	}
</style>

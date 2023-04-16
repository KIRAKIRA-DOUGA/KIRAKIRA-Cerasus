<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: string;
	}>();
</script>

<template>
	<Comp>
		<NuxtIcon v-if="icon" :name="icon" />
		<p><slot></slot></p>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-shrink: 0;
		gap: 0.25rem;
		align-items: center;
		color: c(icon-color);
	}

	.nuxt-icon {
		font-size: 20px;
	}

	p {
		user-select: text;
	}
</style>

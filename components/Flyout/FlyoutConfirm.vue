<docs>

</docs>

<script setup lang="ts">
	const flyout = defineModel<FlyoutModel>();

	const props = defineProps<{
		title?: string;
		icon?: DeclaredIcons;
		severity?: "warning" | "danger";
	}>();
</script>

<template>
	<Flyout v-model="flyout">
		<Comp>
			<ShadingIcon v-if="icon" :icon="icon" size="small" fadeIn />
			<div class="content">
				<p v-if="title" class="title">{{ title }}</p>
				<p v-if="$slots.default"><slot></slot></p>
			</div>
			<div v-if="$slots.footer" class="footer">
				<slot name="footer"></slot>
			</div>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: min(250px, 100dvw);
	}

	.title {
		font-weight: bold;
	}

	.footer {
		display: flex;
		flex-shrink: 0;
		gap: 8px;
		margin-top: 12px;
	}
</style>

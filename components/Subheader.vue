<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon?: DeclaredIcons;
		/** 角标。 */
		badge?: Readable;
	}>(), {
		icon: "apps",
		badge: undefined,
	});
</script>

<template>
	<h3 class="subheader">
		<Icon :name="icon" />
		<div class="title">
			<slot></slot>
		</div>
		<Badge v-if="badge || badge === 0" class="badge">
			{{ badge }}
		</Badge>
	</h3>
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

	.badge {
		font-weight: normal;
		font-size: 14px;
	}
</style>

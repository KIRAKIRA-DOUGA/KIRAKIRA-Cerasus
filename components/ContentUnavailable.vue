<script setup lang="ts">
	const { t } = useI18n();

	const props = defineProps<{
		type?: "error" | "search";
		icon?: string;
		title?: string;
		description?: string;
	}>();

	const icon = computed(() => props.icon ?? props.type ?? "info");

	const title = computed(() =>
		props.title ?? (
			props.type === "error" ? t("severity.error") :
			props.type === "search" ? t("empty.search") :
			undefined
		),
	);

	const description = computed(() =>
		props.description ?? (
			props.type === "error" ? t("toast.something_went_wrong") :
			undefined
		),
	);
</script>

<template>
	<Comp :class="{ error: type === 'error' }">
		<Icon :name="icon" />
		<p v-if="title" class="title">{{ title }}</p>
		<p v-if="description" class="description">{{ description }}</p>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		padding-block: 32px;
		color: c(icon-color);
		text-align: center;

		&.error .icon {
			color: c(red);
		}

		.icon {
			font-size: 56px;
		}

		.title {
			font-size: 24px;
			font-weight: bold;
		}
	}
</style>

<script setup lang="ts">
	const { t } = useI18n();

	const props = defineProps<{
		type?: "error" | "search";
		icon?: string;
		title?: string;
		description?: string;
		needLogin?: boolean;
		page?: boolean;
	}>();

	const icon = computed(() => props.icon ?? props.type ?? undefined);

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
	<Comp :class="{ error: type === 'error', page }">
		<div v-if="icon || $slots.icon" class="icon-container">
			<slot name="icon">
				<Icon v-if="icon" :name="icon" />
			</slot>
		</div>
		<p v-if="title" class="title">{{ title }}</p>
		<p v-if="description" class="description">{{ description }}</p>
		<slot name="actions">
			<Button v-if="needLogin" @click="useEvent('app:requestLogin');">{{ t("login") }}</Button>
		</slot>
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

		&.page {
			height: 70vh;
			transition: none;
		}
	}

	.icon-container {
		@include flex-center;
		font-size: 64px;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
	}

	button {
		--appearance: secondary;
	}
</style>

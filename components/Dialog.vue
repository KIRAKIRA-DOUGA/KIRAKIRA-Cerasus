<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});
	const dialog = ref<HTMLDialogElement>();

	watch(open, open => {
		if (!dialog.value) return;
		if (open) dialog.value.showModal();
		else dialog.value.close();
	}, { immediate: true });

	onMounted(() => {
		if (!dialog.value) return;
		dialog.value.addEventListener("close", () => emits("update:modelValue", false));
	});
</script>

<template>
	<Mask v-model="open">
		<div v-if="open" class="dialog">
			<div class="body">
				<NuxtIcon name="info" class="icon" />
				<div>
					<h2>标题</h2>
					<slot>内容<br />内容<br />内容<br />内容<br />内容<br />内容<br />内容</slot>
				</div>
			</div>
			<div class="footer">
				<div class="left">
					<slot name="footer-left"></slot>
				</div>
				<div class="right">
					<slot name="footer-right">
						<Button @click="emits('update:modelValue', false)">了然</Button>
					</slot>
				</div>
			</div>
		</div>
	</Mask>
</template>

<style scoped lang="scss">
	$max-width: 800px;

	.dialog {
		@include radius-large;
		@include dropdown-flyouts;
		width: 100vw;
		max-width: $max-width;
		margin: 0 auto;
		background-color: c(inner-color-85, 50%);

		.body {
			@include card-in-card-shadow;
			display: flex;
			gap: 1rem;
			padding: 24px;
			background-color: c(white, 75%);

			.icon {
				@include flex-block;
				font-size: 48px;
			}

			h2 {
				margin: 0 0 12px;
			}
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 12px 24px;
		}
	}
</style>

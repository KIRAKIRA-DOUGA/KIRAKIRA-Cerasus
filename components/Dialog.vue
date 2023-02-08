<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const isOpen = computed(() => props.modelValue ?? props.open);
	const dialog = ref<HTMLDialogElement>();

	watch(isOpen, open => {
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
	<dialog ref="dialog">
		<p>Greetings, one and all!</p>
		<button>OK</button>
	</dialog>
</template>

<style scoped lang="scss">

</style>

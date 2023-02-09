<script setup lang="ts">
	const props = withDefaults(defineProps<{
		modelValue?: boolean;
		shown?: boolean;
		zIndex?: number;
		static?: boolean;
	}>(), {
		zIndex: 50,
	});

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const shown = computed(() => props.modelValue ?? props.shown);
	const mask = ref<HTMLDivElement>();

	/**
	 * 单击遮罩部分关闭内容。
	 * @param e - 鼠标单击事件。
	 */
	function close(e: MouseEvent) {
		if (e.target === mask.value) // 单击的最终元素必须是遮罩本身，不能是其内容。
			emits("update:modelValue", false);
	}
</script>

<template>
	<ClientOnlyTeleport to="body">
		<Transition name="mask">
			<div
				v-if="shown"
				ref="mask"
				class="mask"
				:class="{ static }"
				:style="{ zIndex }"
				@click="close"
			>
				<slot></slot>
			</div>
		</Transition>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	.mask {
		@include full-screen(fixed);

		&:not(.static) {
			background-color: c(main-bg, 40%);
			backdrop-filter: grayscale(0.4);

			&.mask-enter-from,
			&.mask-leave-to {
				opacity: 0;
			}
		}
	}
</style>

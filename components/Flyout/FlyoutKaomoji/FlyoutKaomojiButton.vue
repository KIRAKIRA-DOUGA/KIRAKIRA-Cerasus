<script setup lang="ts">
	const props = defineProps<{
		/** 使用更强烈的色调表示选中聚焦项。 */
		highlighted?: boolean;
	}>();

	const button = ref<InstanceType<typeof Button>>();
	const requireShowTooltip = ref(false);
	const kaomoji = useSlots().default?.()[0]?.children?.toString();

	onMounted(async () => {
		await delay(100); // 等待过渡动画时间，使之计算更准确。
		const buttonEl = button.value?.$el as HTMLButtonElement | undefined;
		if (buttonEl && buttonEl.children[0])
			requireShowTooltip.value = buttonEl.children[0].clientWidth > buttonEl.clientWidth;
	});
</script>

<template>
	<Button
		ref="button"
		v-tooltip:top="requireShowTooltip ? kaomoji : undefined"
		class="flyout-kaomoji-button"
		:class="{ highlighted }"
	><slot></slot></Button>
</template>

<style scoped lang="scss">
	:deep(.button-content) {
		@include chip-shadow;
		@include round-small;
		display: flex;
		height: 24px;
		color: c(text-color);
		background-color: c(main-bg);

		button:comp:active & {
			background-color: c(main-bg);
		}

		button:comp:focus & {
			@include button-shadow-unchecked-focus;
		}

		button:comp.highlighted:focus & {
			@include button-shadow-focus;
			color: white;
			background-color: c(accent);
		}

		button:comp.highlighted:active:focus & {
			background-color: c(accent);
		}

		button:comp:any-hover & {
			@include button-shadow-unchecked-hover;
			background-color: c(gray-5);
		}

		button:comp:any-hover:focus & {
			@include button-shadow-unchecked-hover-focus;
		}

		button:comp.highlighted:any-hover:focus & {
			@include button-shadow-hover-focus;
			background-color: c(accent-hover);
		}
	}

	:where(button:comp) {
		width: 100%;
	}
</style>

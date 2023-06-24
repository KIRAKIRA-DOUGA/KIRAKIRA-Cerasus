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
	button:comp {
		@include chip-shadow;
		@include radius-small;
		display: flex;
		height: 24px;
		color: c(text-color);
		background-color: c(main-bg);

		@media (any-hover: hover) {
			&:hover {
				@include button-shadow-unchecked-hover;
				background-color: c(gray-20);
			}

			&:hover:focus {
				@include button-shadow-unchecked-hover-focus;
			}
			
			&.highlighted:hover:focus {
				@include button-shadow-hover-focus;
				background-color: c(accent-hover);
			}
		}

		&:active {
			background-color: c(main-bg);
		}

		&:focus {
			@include button-shadow-unchecked-focus;
		}

		&.highlighted:focus {
			@include button-shadow-focus;
			color: white;
			background-color: c(accent);
		}

		&.highlighted:active:focus {
			background-color: c(accent);
		}
	}
	
	:where(button:comp) {
		width: 100%;
	}
</style>

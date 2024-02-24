<script setup lang="ts">
	const props = defineProps<{
		/** 滑块最小值。 */
		min?: number;
		/** 滑块最大值。 */
		max?: number;
		/** 滑块默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 */
		defaultValue?: number;
		/** 图标。 */
		icon: DeclaredIcons;
		/** 显示工具提示。 */
		tooltip?: boolean;
	}>();

	const value = defineModel<number>({ required: true });
</script>

<template>
	<Comp class="option-wrapper">
		<Icon :name="icon" />
		<div class="option-content">
			<span><slot></slot></span>
			<Slider v-model="value" :min="min" :max="max" :defaultValue="defaultValue" :tooltip="tooltip" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$padding: 16px;
	$icon-size: 24px;
	$gap: 16px;

	:comp {
		display: flex;
		gap: $gap;
		align-items: center;
		justify-content: center;
		height: 72px;
		padding: 0 $padding;

		.icon {
			color: c(icon-color);
			font-size: 24px;
		}

		.option-content {
			flex-grow: 1;
		}
	}

	.slider {
		margin-bottom: -10px;
	}
</style>

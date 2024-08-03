<script setup lang="ts">
	const props = defineProps<{
		/** 滑块最小值。 */
		min?: number;
		/** 滑块最大值。 */
		max?: number;
		/** 滑块默认值。当单击鼠标中键或触摸屏长按组件时还原默认值。 */
		defaultValue?: number;
		/** 步长。 */
		step?: number;
		/** 图标。 */
		icon: DeclaredIcons;
		/**
		 * 显示待定值工具提示。
		 * - 如留空表示不显示。
		 * - 如为 `current` 表示显示滑块当前值。
		 * - 如为 `cursor` 表示显示光标所在位置的值。
		 */
		pending?: false | "current" | "cursor";
		/** 待定值工具提示的显示值，或将数值转换为显示值的函数。 */
		displayValue?: ((value: number) => Readable) | Readable;
	}>();

	const value = defineModel<number>({ required: true });
</script>

<template>
	<Comp class="option-wrapper">
		<Icon :name="icon" />
		<div class="option-content">
			<span><slot></slot></span>
			<Slider v-model="value" :min :max :step :defaultValue :pending :displayValue />
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
		justify-content: center;
		align-items: center;
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

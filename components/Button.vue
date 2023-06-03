<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: string;
		/** 图标是否放在文本后面。 */
		iconBehind?: boolean;
		/** 是否为次要/无背景按钮。 */
		secondary?: boolean;
		/**
		 * 点击按钮是否切换导航？
		 * #### NOTE
		 * 点击按钮将会立刻切换导航，使单击事件失去作用。
		 *
		 * **不推荐使用该功能**，比如鼠标中键新窗口打开，触屏长按链接操作都将不再起作用。应该使用链接组件。
		 */
		href?: string;
	}>();

	const emits = defineEmits<{
		click: [e: MouseEvent];
	}>();

	/**
	 * 单击鼠标事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		emits("click", e);
	}
</script>

<template>
	<button
		v-ripple
		type="button"
		:class="{ secondary, 'icon-behind': iconBehind }"
		@click="onClick"
	>
		<Icon v-if="icon" :name="icon" />
		<span><slot></slot></span>
		<LocaleLink v-if="href" draggable="false" :to="href" class="link lite" />
	</button>
</template>

<style scoped lang="scss">
	button {
		@include flex-center;
		@include button-shadow;
		@include radius-small;
		position: relative;
		display: inline-flex;
		gap: 8px;
		min-height: 36px;
		padding: 8px 16px;
		color: white;
		letter-spacing: 0.05em;
		white-space: nowrap;
		vertical-align: middle;
		background-color: c(accent);
		transition: $fallback-transitions, all $ease-out-back 500ms !important;

		> span {
			font-family: inherit;
		}

		&.icon-behind {
			flex-direction: row-reverse;
		}

		&:active {
			@include button-scale-pressed;
			background-color: c(accent);
		}

		&[disabled] {
			background-color: c(accent-disabled);
			box-shadow: none !important;
			pointer-events: none;
		}

		&:focus {
			@include button-shadow-focus;
		}

		@media (any-hover: hover) { // 在触摸屏上不要支持 hover 样式。
			&:hover {
				@include button-shadow-hover;
				background-color: c(accent-hover);
			}

			&:hover:focus {
				@include button-shadow-hover-focus;
			}
		}

		&.secondary {
			color: c(accent);
			background-color: transparent;
			box-shadow: none;

			.icon {
				color: c(accent);
			}

			:deep(.ripple-circle) {
				background-color: c(accent-pressed, 15%);
			}

			@media (any-hover: hover) {
				&:hover {
					background-color: c(accent-hover, 8%);
				}
			}

			&:active {
				background-color: c(accent-pressed, 8%);
			}

			&:focus {
				box-shadow: none;
			}

			&:focus-visible {
				@include button-shadow-focus-only;
			}

			&[disabled] {
				color: c(accent-disabled);
			}
		}
	}

	.icon {
		$padding-inset: 2px;
		$size: 18px;
		min-width: $size;
		min-height: $size;
		color: white;
		font-size: $size;

		button:not(.icon-behind) > & {
			margin-left: -$padding-inset;
		}

		button.icon-behind > & {
			margin-right: -$padding-inset;
		}
	}

	.link {
		@include square(100%);
		position: absolute;
	}
</style>

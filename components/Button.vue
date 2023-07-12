<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: string;
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
		type="button"
		@click="onClick"
	>
		<div v-ripple class="button-content">
			<Icon v-if="icon" :name="icon" />
			<span class="caption"><span><slot></slot></span></span>
			<LocaleLink v-if="href" :draggable="false" :to="href" class="link lite" />
		</div>
	</button>
</template>

<style scoped lang="scss">
	@layer props {
		button {
			/// 外观偏好，可选的值为：primary | secondary。
			/// primary: 强调色按钮。
			/// secondary: 次要/无背景按钮。
			--appearance: primary;
			/// 是否隐藏标签文本？
			--hide-caption: false;
			/// 图标是否放在文本后面。
			--icon-behind: false;
		}
	}

	.button-content {
		@include flex-center;
		@include button-shadow;
		@include round-small;
		@include square(inherit);
		position: relative;
		display: inline-flex;
		min-height: 36px;
		padding: 8px 16px;
		color: white;
		letter-spacing: 0.05em;
		white-space: nowrap;
		vertical-align: middle;
		background-color: c(accent);
		transition: $fallback-transitions, all $ease-out-back 500ms !important;
		touch-action: manipulation;

		> span {
			font-family: inherit;
		}

		@container style(--icon-behind: true) {
			flex-direction: row-reverse;
		}

		button:active > & {
			@include button-scale-pressed;
			background-color: c(accent);
		}

		button[disabled] > & {
			background-color: c(accent-disabled);
			box-shadow: none !important;
			pointer-events: none;
		}

		button:focus > & {
			@include button-shadow-focus;
		}

		button:any-hover > & { // 在触摸屏上不要支持 hover 样式。
			@include button-shadow-hover;
			background-color: c(accent-hover);
		}

		button:any-hover:focus > & {
			@include button-shadow-hover-focus;
		}

		@container style(--appearance: secondary) {
			color: c(accent);
			background-color: transparent;

			button:not(:focus-visible) > & {
				box-shadow: none !important;
			}

			.icon {
				margin-right: 8px;
				color: c(accent);
			}

			:deep(.ripple-circle) {
				background-color: c(accent-ripple);
			}

			button:any-hover > &,
			button:active > & {
				background-color: c(accent-hover-overlay);
			}

			button:focus-visible > & {
				@include button-shadow-focus-only;
			}

			button[disabled] > & {
				color: c(accent-disabled);
			}
		}
	}

	@mixin icon-only {
		margin-right: 0 !important;
		font-size: 24px;
	}

	.icon {
		$padding-inset: 2px;
		$size: 18px;
		min-width: $size;
		min-height: $size;
		color: white;
		font-size: $size;

		@container style(--icon-behind: false) {
			margin-left: -$padding-inset;
		}

		@container style(--icon-behind: true) {
			margin-right: -$padding-inset;
		}

		&:has(+ .caption > :empty) {
			@include icon-only;
		}

		@container style(--hide-caption: true) {
			@include icon-only;
		}
	}

	.caption {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		> * {
			overflow: hidden;
		}

		@container style(--hide-caption: true) {
			grid-template-columns: 0fr;
		}
	}

	.link {
		@include square(100%);
		position: absolute;
	}

	button.secondary {
		--appearance: secondary;
	}

	button.icon-behind {
		--icon-behind: true;
	}
</style>

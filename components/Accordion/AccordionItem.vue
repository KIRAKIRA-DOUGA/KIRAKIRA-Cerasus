<docs>
	垂直折叠手风琴。
</docs>

<script setup lang="ts">
	import Accordion from "./Accordion.vue";

	const props = defineProps<{
		/** 标题。 */
		title: Readable;
		/** 是否展示而非折叠？单向绑定使用。 */
		shown?: boolean;
		/** 是否**不**向手风琴内容部分加内边距？ */
		noPadding?: boolean;
	}>();

	const parent = useParent(Accordion);
	const shown = ref(props.shown);

	watch(() => props.shown, requireShown => shown.value = requireShown, { immediate: true });

	/**
	 * 切换展示与折叠状态。
	 */
	async function toggle() {
		const prevShown = shown.value;
		parent?.exposed?.collaspeAll();
		await nextTick();
		shown.value = !prevShown;
	}

	defineExpose({
		shown,
		toggle,
	});
</script>

<template>
	<Comp role="listitem" :aria-label="(title as string)" :aria-expanded="shown">
		<h3 v-ripple class="header" :class="{ shown }" :tabindex="0" @click="toggle">
			<div class="left">
				<Icon name="chevron_down" />
				<div>{{ title }}</div>
			</div>
			<div class="right">
				<slot name="actions"></slot>
			</div>
		</h3>
		<Transition>
			<div v-if="shown" class="content" :class="{ 'no-padding': noPadding }">
				<div><slot></slot></div>
			</div>
		</Transition>
	</Comp>
</template>

<style scoped lang="scss">
	$padding: 12px 16px;

	:comp {
		@include round-large;

		> * {
			padding: $padding;
			// border-bottom: c(gray-30) 1px solid; // 有一说一，边框线确实丑。
			transition: $fallback-transitions, padding $ease-out-smooth 500ms;
		}

		&:first-child > .header {
			@include round-large(top);
		}

		&:last-child > *:last-child {
			@include round-large(bottom);
			border-bottom: none;
		}
	}

	.header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: clip;
		font-weight: normal;
		font-size: inherit;
		cursor: pointer;

		> * {
			display: flex;
			align-items: center;
		}

		.icon {
			@include enable-hardware-3d;
			margin-right: 4px;
			margin-left: -4px;
			color: c(icon-color);
			font-size: 20px;
			backface-visibility: hidden;
			perspective: 1000;
			transition: $fallback-transitions, all $ease-out-smooth 500ms;
		}

		&:focus-visible {
			@include button-shadow-unchecked-focus-only;
			z-index: 1;
		}

		&:any-hover {
			padding-left: 1.25rem;
			background-color: c(hover-overlay);
		}

		&.shown {
			color: c(accent);
			background-color: c(accent-10);

			html.dark & {
				color: c(icon-color);
			}

			.icon {
				color: inherit;
				rotate: 0.5turn;
			}

			&:focus-visible {
				@include button-shadow-focus-only;
			}

			&:any-hover {
				background-color: c(accent-10, 50%);
			}

			html:not(.dark) & {
				@include accent-ripple;

				.right :deep(.soft-button) {
					--active: true;
				}
			}
		}
	}

	.content {
		@include animated-auto-size(height);
		overflow: clip;
		transition-duration: 500ms;

		&.no-padding {
			padding: 0 !important;
		}
	}
</style>

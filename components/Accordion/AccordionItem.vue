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
	<Comp :aria-label="(title as string)" :aria-expanded="shown">
		<h3 v-ripple class="header" :class="{ shown }" :tabindex="0" @click="toggle">
			<div>{{ title }}</div>
			<Icon name="chevron_down" />
		</h3>
		<Transition>
			<div v-if="shown" class="content" :class="{ 'no-padding': noPadding }">
				<div><slot></slot></div>
			</div>
		</Transition>
	</Comp>
</template>

<style scoped lang="scss">
	$padding: 0.75rem 1rem;

	:comp {
		@include radius-large;

		> * {
			padding: $padding;
			// border-bottom: c(gray-30) 1px solid; // 有一说一，边框线确实丑。
			transition: $fallback-transitions, padding $ease-out-smooth 500ms;
		}

		&:first-child > .header {
			@include radius-large(top);
		}

		&:last-child > *:last-child {
			@include radius-large(bottom);
			border-bottom: none;
		}
	}

	.header {
		@include flex-center;
		position: relative;
		justify-content: space-between;
		font-weight: normal;
		font-size: inherit;
		cursor: pointer;

		.icon {
			@include enable-hardware-3d;
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

		&:hover {
			padding-left: 1.25rem;
			background-color: c(gray-30, 20%);
		}

		&.shown {
			color: c(accent);
			background-color: c(accent-10);

			.dark & {
				color: c(icon-color);
			}

			.icon {
				color: inherit;
				rotate: 0.5turn;
			}

			&:focus-visible {
				@include button-shadow-focus-only;
			}

			&:hover {
				background-color: c(accent-10, 50%);
			}
		}
	}

	.content {
		@include animated-auto-size(height);
		transition-duration: 500ms;

		&.no-padding {
			padding: 0 !important;
		}
	}
</style>

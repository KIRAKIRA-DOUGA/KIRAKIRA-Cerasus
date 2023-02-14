<script lang="ts">
	export type MaskSlotPosition = "left top" | "center top" | "right top" | "left center" | "center" | "right center" | "left bottom" | "center bottom" | "right bottom";
</script>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		modelValue?: boolean;
		shown?: boolean;
		zIndex?: number;
		static?: boolean;
		position?: MaskSlotPosition;
	}>(), {
		zIndex: 50,
		position: "center",
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
		<Fragment :style="{ '--z-index': zIndex }">
			<Transition name="mask">
				<div
					v-if="shown"
					ref="mask"
					class="mask"
					:class="[position, { static }]"
					@click="close"
				></div>
			</Transition>
			<slot><div></div></slot>
		</Fragment>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	.mask {
		@include full-screen(fixed);
		$slot: "+ :deep(*)";

		&:not(.static) {
			background-color: c(main-bg, 40%);
			backdrop-filter: grayscale(0.4);

			&.mask-enter-from,
			&.mask-leave-to {
				opacity: 0;
			}
		}

		&,
		& #{$slot} {
			z-index: var(--z-index);
		}

		#{$slot} {
			position: fixed;
			margin: auto;
		}

		&.left #{$slot} {
			left: 0;
		}

		&.right #{$slot} {
			right: 0;
		}

		&.top #{$slot} {
			top: 0;
		}

		&.bottom #{$slot} {
			bottom: 0;
		}

		&.center {
			&:not(.left, .right) #{$slot} {
				right: 0;
				left: 0;
			}

			&:not(.top, .bottom) #{$slot} {
				top: 0;
				bottom: 0;
			}
		}
	}
</style>

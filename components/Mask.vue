<script lang="ts">
	export type MaskSlotPosition = "left top" | "center top" | "right top" | "left center" | "center" | "right center" | "left bottom" | "center bottom" | "right bottom";
</script>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 是否显示。 */
		modelValue?: boolean;
		/** 是否显示，兼容使用。 */
		shown?: boolean;
		/** CSS 中的 Z 轴高度。 */
		zIndex?: number;
		/** 是否是静态的，即没有外观，形式上的遮罩。 */
		static?: boolean;
		/** 指定内容的位置。 */
		position?: MaskSlotPosition;
		/** 是否**不要**单击空白处关闭。由于 Vue 的设计，只能设为否定形式的属性。 */
		doNotCloseWhenClicked?: boolean;
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
			if (props.doNotCloseWhenClicked)
				replayAnimation(mask.value, "focusing");
			else
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
		$slot: "+ :slotted(*)";

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
			// z-index: v-bind(zIndex); // TODO: v-bind 在 Teleport 内部不可用。请时刻关注 Vue 的更新：https://github.com/vuejs/core/issues/4605
		}

		&.focusing #{$slot} {
			animation: shake 1s $ease-out-smooth;
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

	@keyframes shake {
		10% {
			transform: rotate(10deg);
		}

		20% {
			transform: rotate(-5deg);
		}

		30% {
			transform: rotate(2.5deg);
		}

		40% {
			transform: rotate(-2.5deg);
		}

		50%,
		100% {
			transform: rotate(0deg);
		}
	}
</style>

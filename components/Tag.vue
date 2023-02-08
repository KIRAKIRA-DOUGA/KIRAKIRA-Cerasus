<script setup lang="ts">
	const props = defineProps<{
		/** 勾选。 */
		modelValue?: boolean;
		/** 勾选，兼容使用。 */
		checked?: boolean;
		/** 禁用。 */
		disabled?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", on: boolean): void;
	}>();

	const isChecked = computed(() => props.modelValue ?? props.checked);
</script>

<template>
	<kira-component v-ripple class="tag" :class="{ checked: isChecked }" @click="emits('update:modelValue', !modelValue)">
		<div class="circle"></div>
		<div class="content">
			<Transition name="check">
				<div v-if="isChecked" class="check-wrapper">
					<NuxtIcon name="check" class="check" />
				</div>
			</Transition>
			<slot></slot>
		</div>
	</kira-component>
</template>

<style scoped lang="scss">
	$check-icon-size: 19px;
	$duration: 400ms;

	.tag {
		@include oval;
		position: relative;
		display: inline-flex;
		padding: 6px 12px;
		overflow: hidden;
		background-color: c(text-color, 5%);
		cursor: pointer;

		&.checked {
			padding: 6px 16px 6px 12px;
			color: white;
			background-color: c(accent);

			&,
			& * {
				transition: $fallback-transitions, all $ease-out-back $duration, color 50ms;
			}
		}

		&,
		& * {
			transition: $fallback-transitions, all $ease-out-expo $duration;
		}
	}

	.check-wrapper {
		display: inline;
		width: $check-icon-size;
		height: $check-icon-size;
		overflow: hidden;

		&.check-enter-from,
		&.check-leave-to {
			width: 0;
			scale: 0;
		}

		.check {
			color: white;
			font-size: $check-icon-size;
		}
	}

	.content {
		position: relative;
		z-index: 2;
		display: inline-flex;
		gap: 0;

		.checked & {
			gap: 8px;
		}
	}

	.circle {
		@include square(10px);
		@include circle;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		display: none; // TODO: 圆圈动画效果待做。
		background-color: c(accent);
	}
</style>

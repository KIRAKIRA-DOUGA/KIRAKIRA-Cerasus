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
	<div v-ripple class="tag" :class="{ checked: isChecked }" @click="emits('update:modelValue', !modelValue)">
		<div class="circle"></div>
		<div class="content">
			<Transition name="check">
				<div v-if="isChecked" class="check-wrapper">
					<NuxtIcon name="check" class="check" />
				</div>
			</Transition>
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$check-icon-size: 19px;
	$color-transition: color $ease-out-expo 100ms, fill $ease-out-expo 100ms;
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
				transition: all $ease-out-back $duration, $color-transition;
			}
		}

		&,
		& * {
			transition: all $ease-out-expo $duration, $color-transition;
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
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		display: none; // TODO: 圆圈动画效果待做。
		width: 10px;
		height: 10px;
		background-color: c(accent);
		border-radius: 100%;
	}
</style>

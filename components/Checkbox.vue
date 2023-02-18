<script setup lang="ts">
	import animationCheck from "lotties/checkbox-check.json";
	const props = withDefaults(defineProps<{
		/** # 禁用 */
		disabled?: boolean;
		/** # 复选状态 */
		checkState?: "unchecked" | "indeterminate" | "checked";
	}>(), {
		checkState: "unchecked",
	});
</script>

<template>
	<kira-component
		class="checkbox"
		:class="{
			checked: checkState === 'checked',
			indeterminate: checkState === 'indeterminate',
			disabled,
		}"
	>
		<input ref="checkbox" type="checkbox" :checked="checkState === 'checked'" :disabled="disabled" />
		<div class="box-focus">
			<div class="box-shadow">
				<div class="box">
					<!-- Lottie Here -->
				</div>
			</div>
		</div>
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	$size: 18px;
	$roundness: 2px;
	$component-class: ".checkbox";

	#{$component-class} {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
	}

	input {
		display: none;
	}

	.box {
		width: $size;
		height: $size;
		border-radius: $roundness;
	}

	.box-shadow {
		@include square($size);
		border-radius: $roundness;

		#{$component-class}.checked & {
			@include button-shadow;
		}

		#{$component-class}.checked:hover & {
			@include button-shadow-hover;
		}

		#{$component-class}.checked:active & {
			box-shadow: none !important;
		}
	}

	.box-focus {
		@include square($size);
		border-radius: $roundness;

		#{$component-class}:focus & {
			@include large-shadow-unchecked-focus;
		}

		#{$component-class}.checked:focus & {
			@include large-shadow-focus;
		}
	}
</style>

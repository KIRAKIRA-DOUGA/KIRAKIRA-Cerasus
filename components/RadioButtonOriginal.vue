<script setup lang="ts" generic="T">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value: T;
		/** 当前绑定值。 */
		modelValue?: T;
	}>(), {
		disabled: false,
		modelValue: "",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: T): void;
	}>();

	const radio = ref<HTMLInputElement>();
	const isChecked = computed(() => props.modelValue === props.value);

	/**
	 * 数据改变事件。
	 */
	function onChange() {
		if (!radio.value) return;
		emits("update:modelValue", radio.value.value as T);
	}
	// BUG: 目前的问题，如果在页面刚刚加载时快速选中两个单选框，会发生两个单选框同时被选中的 bug。
</script>

<template>
	<label @click="onChange">
		<input
			ref="radio"
			class="radio"
			type="radio"
			:checked="isChecked"
			:value="value"
			@change="onChange"
		/>
		<slot></slot>
	</label>
</template>

<style scoped lang="scss">
	label {
		display: flex;
		align-items: center;
	}

	$size: 20px;
	$white-size: 16px;
	$dot-size: 10px;
	$border-size: 2px;
	$duration-half: 200ms;

	.radio {
		position: relative;
		width: $size;
		height: $size;
		margin: 0;
		margin-right: 0.5rem;
		overflow: hidden;
		background-color: c(main-bg);
		border-radius: 100%;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: all $ease-in-out-max calc($duration-half * 2);
		animation:
			outer-border-change-back $duration-half $duration-half $ease-in-max reverse,
			pressing-back $duration-half $ease-in alternate 2;
		appearance: none;

		&::before {
			position: absolute;
			display: block;
			width: $size;
			height: $size;
			background-color: c(icon-color);
			border-radius: 100%;
			transform: scale(0.5);
			opacity: 0;
			transition: all $ease-in-out-max calc($duration-half * 2);
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
			content: "";
		}

		&:checked {
			box-shadow: inset 0 0 0 2px c(accent);
			animation:
				outer-border-change $duration-half $ease-in-max,
				pressing $duration-half $ease-in alternate 2;

			&::before {
				background-color: c(accent);
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;
			}
		}

		/* &:focus { // NOTODO: 聚焦环炸了。
			box-shadow: 0 1px 6px #f06e8ecc, 0 0 0 10px #f8afb880;
		} */
	}

	$animation-key: "", "-back"; // 故意把动画写两遍，让 CSS 以为是两个动画。

	@each $key in $animation-key {
		@keyframes outer-border-change#{$key} {
			from {
				box-shadow: inset 0 0 0 $border-size c(icon-color);
			}

			to {
				box-shadow: inset 0 0 0 calc($size / 2) c(accent);
			}
		}

		@keyframes inner-resize#{$key} {
			from {
				transform: scale(1);
			}

			to {
				transform: scale(0.5);
			}
		}

		@keyframes pressing#{$key} {
			from {
				transform: scale(1);
			}

			to {
				transform: scale(calc(18 / 20));
			}
		}
	}

	@keyframes cut-in {
		from,
		to {
			opacity: 0;
		}
	}

	@keyframes cut-out {
		from,
		to {
			opacity: 1;
		}
	}
</style>

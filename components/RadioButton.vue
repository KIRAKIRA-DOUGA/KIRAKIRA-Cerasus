<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value: string;
		/** 当前绑定值。 */
		modelValue?: string;
	}>(), {
		disabled: false,
		modelValue: "",
	});

	const emits = defineEmits<{
		(event: "update:modelValue", value: string): void;
	}>();

	const radio = ref<HTMLInputElement>();
	const isChecked = computed(() => props.modelValue === props.value);

	/**
	 * 数据改变事件。
	 */
	function onChange() {
		if (!radio.value) return;
		emits("update:modelValue", radio.value.value);
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
	$duration-half: 250ms;

	@property --color {
		syntax: "<color>";
		inherits: true;
	}

	.radio {
		// --color: #{$light-mode-icon-color-400}; // TODO: 颜色过渡动画有些问题，暂时改为 filter 过渡动画。
		--color: var(--accent);

		appearance: none;
		margin: 0;
		margin-right: 0.5rem;
		width: $size;
		height: $size;
		background-color: transparent;
		box-shadow: inset 0 0 0 $border-size var(--color);
		border-radius: 100%;
		position: relative;
		animation:
			outer-border-change-back $duration-half $duration-half $ease-in-max reverse,
			pressing-back $duration-half $ease-in alternate 2;
		overflow: hidden;
		filter: grayscale(1);
		transition: all $ease-in-out-max calc($duration-half * 2);

		&::before {
			content: "";
			width: $dot-size;
			height: $dot-size;
			background-color: var(--color);
			display: block;
			border-radius: 100%;
			$margin: calc(($size - $dot-size) / 2);
			position: absolute;
			left: $margin;
			top: $margin;
			opacity: 0;
			animation:
				inner-resize-back $duration-half $ease-out-max reverse,
				cut-out $duration-half step-start;
		}

		&:checked {
			// --color: var(--accent);

			filter: grayscale(0);
			animation:
				outer-border-change $duration-half $ease-in-max,
				pressing $duration-half $ease-in alternate 2;

			&::before {
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;
			}
		}

		/* &:focus { // TODO: 聚焦环炸了。
			box-shadow: 0 1px 6px #f06e8ecc, 0 0 0 10px #f8afb880;
		} */
	}

	$animation-key: "", "-back"; // 故意把动画写两遍，让 CSS 以为是两个动画。

	@each $key in $animation-key {
		@keyframes outer-border-change#{$key} {
			from {
				box-shadow: inset 0 0 0 $border-size var(--color);
			}

			to {
				box-shadow: inset 0 0 0 calc($size / 2) var(--color);
			}
		}

		@keyframes inner-resize#{$key} {
			from {
				transform: scale(2);
			}

			to {
				transform: scale(1);
			}
		}

		@keyframes pressing {
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

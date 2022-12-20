<script lang="tsx">
	interface Props<T> {
		/** 禁用。 */
		disabled?: boolean;
		/** 值。 */
		value: T;
		/** 当前绑定值。 */
		modelValue?: T;
	}

	interface Emits<T> {
		(event: "update:modelValue", value: T): void;
	}

	export default function RadioButton<T>(props: Props<T>, { slots, emit }: { slots: { default?: Function }; emit: Emits<T> }) {
		const radio = ref<HTMLInputElement>();
		const isChecked = props.modelValue === props.value;
		const onChange = () => {
			if (!radio.value) return;
			emit("update:modelValue", radio.value.value as T);
		};
		const styles = useCssModule();
		const slot = slots.default && <span>{slots.default()}</span>;

		return (
			<div class={styles.label} onClick={onChange} tabindex={0}>
				<input
					ref={radio}
					type="radio"
					checked={isChecked}
					value={props.value}
				/>
				<div class={styles.radioFocus}>
					<div class={styles.radio}></div>
				</div>
				{slot}
			</div>
		);
	}
</script>

<style module lang="scss">
	.label {
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
		overflow: hidden;
		background-color: c(main-bg);
		border-radius: 100%;
		box-shadow: inset 0 0 0 $border-size c(icon-color);
		transition: all $ease-in-out-max calc($duration-half * 2);
		animation: outer-border-change-back $duration-half $duration-half $ease-in-max reverse;
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
	}

	input:checked + .radio-focus {
		animation: pressing $duration-half $ease-in alternate 2;

		& .radio {
			box-shadow: inset 0 0 0 2px c(accent);
			animation: outer-border-change $duration-half $ease-in-max;

			&::before {
				background-color: c(accent);
				opacity: 1;
				animation:
					inner-resize $duration-half $duration-half $ease-out-max,
					cut-in $duration-half step-start;
			}
		}
	}

	.radio-focus {
		width: $size;
		height: $size;
		border-radius: 100%;
		animation: pressing-back $duration-half $ease-in alternate 2;

		.label:focus & {
			box-shadow: 0 1px 6px c(icon-color, 50%), 0 0 0 10px c(gray-2, 50%);
		}

		.label:focus input:checked + & {
			box-shadow: 0 1px 6px c(accent, 80%), 0 0 0 10px c(accent-focus, 50%);
		}

		& + span {
			margin-left: 0.5rem;
		}
	}

	input {
		display: none;
	}

	// TODO: 接下来请你编写 hover、pressed、disabled 样式。

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

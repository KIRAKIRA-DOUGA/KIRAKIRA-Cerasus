<script setup lang="ts">
	const props = defineProps<{
		/** 勾选，单向绑定使用。 */
		checked?: boolean;
		/** 禁用。 */
		disabled?: boolean;
		/** 链接。 */
		link?: string;
		/** URL Search Params. */
		query?: UrlQueryType;
	}>();

	const model = defineModel<boolean>();
	const isChecked = withOneWayProp(model, () => props.checked);
</script>

<template>
	<LocaleLink
		v-ripple
		class="tag lite"
		:class="{ checked: isChecked }"
		:to="link || '#'"
		:query="query"
		draggable="false"
		tabindex="0"
		role="checkbox"
		:aria-checked="isChecked"
		aria-label="tag"
		@click="model = !model"
	>
		<div class="circle"></div>
		<div class="content">
			<Transition>
				<div v-if="isChecked" class="check-wrapper">
					<Icon name="check" class="check" />
				</div>
			</Transition>
			<slot></slot>
		</div>
	</LocaleLink>
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
		color: inherit;
		font-size: inherit;
		background-color: c(text-color, 5%);
		cursor: pointer;

		&:hover {
			@include button-shadow-unchecked-hover;
		}

		&:focus {
			@include button-shadow-unchecked-focus;
		}

		&:hover:focus {
			@include button-shadow-unchecked-hover-focus;
		}

		&.checked {
			padding: 6px 16px 6px 12px;
			color: white;
			background-color: c(accent);

			&:hover {
				@include button-shadow-hover;
			}

			&:focus {
				@include button-shadow-focus;
			}

			&:hover:focus {
				@include button-shadow-hover-focus;
			}

			&,
			* {
				transition: $fallback-transitions, all $ease-out-back $duration, color 50ms;
			}
		}

		&,
		* {
			transition: $fallback-transitions, all $ease-out-expo $duration;
		}
	}

	.check-wrapper {
		display: inline;
		width: $check-icon-size;
		height: $check-icon-size;
		overflow: hidden;

		&.v-enter-from,
		&.v-leave-to {
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
		display: none;
		background-color: c(accent);
	}
</style>

<script setup lang="ts" generic="T extends PropertyKey | Readable">
	const props = withDefaults(defineProps<{
		/** 标题文本。 */
		title?: string;
		/** 指定当前项目的标识符。 */
		id: T;
		/** 开启水波纹？默认为是。 */
		ripple?: boolean;
		/** 使用自定义选中状态覆盖默认值。 */
		checked?: boolean;
	}>(), {
		title: "",
		ripple: true,
		checked: undefined,
	});

	const radio = refComp();
	const selected = defineModel<T | T[]>({ default: [] });
	const isRadio = computed(() => !Array.isArray(selected.value));
	const active = computed(() => {
		if (props.checked !== undefined) return props.checked;
		if (isRadio.value)
			return selected.value === props.id;
		else
			return (selected.value as T[]).includes(props.id);
	});

	/**
	 * 点击勾选事件。
	 */
	function onCheck() {
		if (isRadio.value)
			selected.value = props.id;
		else
			arrayToggle(selected.value as T[], props.id);
	}

	// 如果勾选情况与 prop 不同，就强制使其相同。
	watch(() => radio.value?.classList.contains("active"), () => {
		if (!radio.value) return;
		if (active.value !== radio.value.classList.contains("active"))
			setClassEnabled(radio, "active", active.value);
	}, { immediate: true });
</script>

<template>
	<Comp
		ref="radio"
		role="radio"
		:aria-checked="active"
		:class="{ active }"
		:tabindex="0"
		@click="onCheck"
		@keydown.space.prevent.stop
		@keyup.space.prevent="onCheck"
		@keyup.enter.prevent="onCheck"
	>
		<div>
			<div v-ripple="ripple" class="thumbnail">
				<slot></slot>
			</div>
			<div v-if="props.title" class="caption">
				<Icon name="check_circle_outline" />
				<div class="title">{{ props.title }}</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	.caption {
		position: relative;

		.title {
			overflow: clip;
			color: c(icon-color);
			white-space: nowrap;
			text-align: justify;
			text-overflow: ellipsis;

			:comp.active & {
				margin-left: 24px + 5px;
				color: c(accent);
				font-weight: bold;
			}
		}

		.icon {
			position: absolute;
			top: -3px;
			color: c(accent);
			font-size: 24px;
			transform-origin: left center;

			:comp:not(.active) & {
				scale: 0.5;
				opacity: 0;
			}
		}
	}

	.thumbnail {
		@include round-large;
		@include chip-shadow;
		@include flex-center;
		container: card / inline-size;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		overflow: clip;
		background-color: c(surface-color);
		cursor: pointer;
		transition: $fallback-transitions, scale $ease-out-back 500ms !important;

		:comp:any-hover & {
			@include chip-shadow-hover;
		}

		:comp:any-hover:focus & {
			@include chip-shadow-hover-focus;
		}

		:comp:active & {
			@include button-scale-pressed;
		}

		:comp:focus & {
			@include chip-shadow-focus;
		}

		:comp.active:focus & {
			@include chip-shadow-checked-focus;
		}

		:comp.active & {
			@include chip-shadow-checked;
			@include accent-ripple;
		}

		:comp.active:any-hover & {
			@include chip-shadow-checked-hover;
		}
	}

	:comp > * {
		display: flex;
		flex-direction: column;
		gap: 12px;

		@container style(--column: single) {
			flex-direction: row;
			align-items: center;

			.thumbnail {
				flex-shrink: 0;
				width: 135px;
			}
		}
	}
</style>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		title?: string;
		id: string;
	}>(), {
		title: "",
	});

	const selected = defineModel<string | string[]>({ default: [] });
	const isRadio = computed(() => typeof selected.value === "string");
	const active = computed(() => {
		if (isRadio.value)
			return selected.value === props.id;
		else
			return selected.value.includes(props.id);
	});

	/**
	 * 点击勾选事件。
	 */
	function onCheck() {
		if (isRadio.value)
			selected.value = props.id;
		else
			arrayToggle(selected.value as string[], props.id);
	}
</script>

<template>
	<Comp role="radio" :aria-checked="active" :class="{ active }" @click="onCheck">
		<div v-ripple class="thumbnail">
			<slot></slot>
		</div>
		<div class="caption">
			<Icon name="check_circle_outline" />
			<div class="title">{{ props.title }}</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	.caption {
		position: relative;
		margin-top: 12px;

		.title {
			overflow: hidden;
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
				opacity: 0;
				scale: 0.5;
			}
		}
	}

	.thumbnail {
		@include round-large;
		@include chip-shadow;
		@include flex-center;
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		overflow: hidden;
		container: card / inline-size;
		cursor: pointer;
		transition: $fallback-transitions, scale $ease-out-back 500ms !important;
		
		&:any-hover {
			@include chip-shadow-hover;
		}
		
		&:active {
			@include button-scale-pressed;
		}
		
		:comp.active & {
			@include chip-shadow-checked;
			
			:deep(.ripple-circle) {
				background-color: c(accent-ripple);
			}
			
			&:any-hover {
				@include chip-shadow-checked-hover;
			}
		}
	}
</style>

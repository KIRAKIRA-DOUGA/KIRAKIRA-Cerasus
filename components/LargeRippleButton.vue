<script setup lang="ts">
	const props = defineProps<{
		icon?: string;
		text?: string;
	}>();

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();
</script>

<template>
	<div class="button-wrapper">
		<button v-ripple type="button" @click="e => emits('click', e)">
			<NuxtIcon v-if="icon" :name="icon" class="icon" />
			<span v-if="text"><span>{{ text }}</span></span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	$button-wrapper-size: 40px;

	.icon {
		color: c(icon-color);
		font-size: 24px;
	}

	.button-wrapper {
		@include flex-center;
		@include circle;
		@include ripple-clickable-only-inside($button-wrapper-size);

		button {
			@include flex-center;
			@include circle;
			position: relative;
			flex-shrink: 0;
			color: c(icon-color);
			font-weight: 600;
			background: none;
			border: none;
			cursor: pointer;
			appearance: none;

			&:focus-visible {
				@include button-shadow-focus;
			}

			&:is(:hover, :active) {
				background-color: c(hover-color);
			}
		}
	}

	:where(.button-wrapper) {
		@include square($button-wrapper-size);
	}

	:where(.button-wrapper button) {
		@include square(40px);
	}

	:where(.button-wrapper button:is(:hover, :active, :has(> * + *)):not(:focus-visible)) {
		@include square(64px);
	}
</style>

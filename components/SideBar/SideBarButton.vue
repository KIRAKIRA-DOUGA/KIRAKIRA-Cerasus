<script setup lang="ts">
	import { LocaleLink } from "#components"; // 注意千万不要用 NuxtLink，要用 LocaleLink。

	const props = defineProps<{
		icon: string;
		to?: string;
	}>();
</script>

<template>
	<component
		:is="to ? LocaleLink : 'div'"
		v-ripple
		:to="to"
		class="button-wrapper lite"
		draggable="false"
		activable
		:tabindex="0"
	>
		<div class="button">
			<NuxtIcon :name="icon" class="icon" :tabindex="-1" />
		</div>
	</component>
</template>

<style scoped lang="scss">
	$icon-size: 40px;

	.button-wrapper {
		@include flex-center;
		@include circle;
		width: $icon-size;
		cursor: pointer;

		&:focus-visible {
			@include button-shadow-focus;
		}

		&:is(:hover, :active) {
			background-color: c(hover-color);
		}
	}

	.button {
		@include flex-center;
		@include square($icon-size);
		@include circle;
		color: c(icon-color);
		font-size: 24px;

		.router-link-active & {
			color: c(accent);
		}
	}
</style>

<script setup lang="ts">
	import "assets/styles/css-doodles/background.css";

	const props = defineProps<{
		rule?: string;
		fullscreen?: boolean;
		styles?: string;
	}>();
</script>

<template>
	<kira-component class="wrapper">
		<component :is="'style'" v-if="styles">
			{{ styles }}
		</component>
		<css-doodle use="var(--rule)" :class="[rule, { fullscreen }]">
			<slot></slot>
		</css-doodle>
	</kira-component>
</template>

<i18n lang="json5">

</i18n>

<style scoped lang="scss">
	css-doodle {
		contain: none;

		&.fullscreen {
			@include full-screen;
		}
	}

	.wrapper {
		@include full-screen;
		@include flex-center;
	}
</style>

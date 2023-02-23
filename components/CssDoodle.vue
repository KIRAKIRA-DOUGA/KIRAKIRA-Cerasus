<script setup lang="ts">
	const props = defineProps<{
		rule?: string;
		fullscreen?: boolean;
		styles?: string;
		use?: string;
	}>();

	const use = computed(() => props.use ? `var(--${props.use})` : "");
</script>

<template>
	<kira-component class="wrapper">
		<component :is="'style'" v-if="styles" scoped>
			{{ styles }}
		</component>
		<css-doodle :use="use" :class="{ fullscreen }">
			{{ rule }}
		</css-doodle>
	</kira-component>
</template>

<i18n lang="json5">

</i18n>

<style scoped lang="scss">
	css-doodle {
		contain: none;
		color: transparent;

		&.fullscreen {
			@include full-screen;
		}
	}

	.wrapper {
		@include full-screen;
		@include flex-center;
	}
</style>

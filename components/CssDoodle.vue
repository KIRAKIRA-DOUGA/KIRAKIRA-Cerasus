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
	<Comp class="wrapper" role="img">
		<component :is="'style'" v-if="styles" scoped>
			{{ styles }}
		</component>
		<css-doodle :use="use" :class="{ fullscreen }">
			{{ rule }}
		</css-doodle>
	</Comp>
</template>

<style scoped lang="scss">
	css-doodle {
		contain: none;
		color: transparent;

		&.fullscreen {
			@include fullscreen;
		}
	}

	:comp.wrapper {
		@include fullscreen;
		@include flex-center;
	}
</style>

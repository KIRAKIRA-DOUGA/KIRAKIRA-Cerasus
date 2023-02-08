<script setup lang="ts">
	import { RendererElement } from "vue";
	const props = defineProps<{
		to?: string | RendererElement | null | undefined;
	}>();
</script>

<template>
	<ClientOnly>
		<Teleport :to="to">
			<slot></slot>
		</Teleport>
	</ClientOnly>
</template>

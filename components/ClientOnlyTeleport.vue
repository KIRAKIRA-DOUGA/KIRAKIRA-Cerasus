<script setup lang="ts">
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

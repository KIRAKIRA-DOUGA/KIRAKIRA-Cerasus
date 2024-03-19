<!-- DELETE: 自 Nuxt 3.11 开始即将弃用！ -->

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

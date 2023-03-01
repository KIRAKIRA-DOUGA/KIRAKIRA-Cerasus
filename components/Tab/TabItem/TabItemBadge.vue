<script setup lang="ts">
	const props = defineProps<{
		id: string;
		badge: string | number;
	}>();
</script>

<template>
	<TabItem :id="id" vertical>
		<Badge :style="{ width: '100%' }">{{ badge }}</Badge>
		<slot>{{ t.home }}</slot>
	</TabItem>
</template>

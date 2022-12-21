<script setup lang="ts">
	const props = defineProps<{
		to: string;
	}>();

	const localePath = useLocalePath();
</script>

<template>
	<NuxtLink :to="localePath(to)">
		<slot></slot>
	</NuxtLink>
</template>

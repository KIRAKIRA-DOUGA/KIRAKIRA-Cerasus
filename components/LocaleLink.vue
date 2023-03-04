<script setup lang="tsx">
	const props = defineProps<{
		to: string;
		linkInLink?: boolean;
	}>();

	const localePath = useLocalePath();
</script>

<template>
	<NuxtLink v-if="!linkInLink" :to="localePath(to)"><slot></slot></NuxtLink>
	<object v-else>
		<NuxtLink :to="localePath(to)"><slot></slot></NuxtLink>
	</object>
</template>

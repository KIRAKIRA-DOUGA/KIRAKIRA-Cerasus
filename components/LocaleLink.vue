<script setup lang="ts">
	const props = defineProps<{
		to: string;
		linkInLink?: boolean;
		activable?: boolean;
	}>();

	const localePath = useLocalePath();

	const enableActiveClass = computed(() => props.activable ? {} : { activeClass: " ", exactActiveClass: " " });
</script>

<template>
	<NuxtLink v-if="!linkInLink" :to="localePath(to)" v-bind="enableActiveClass"><slot></slot></NuxtLink>
	<object v-else>
		<NuxtLink :to="localePath(to)" v-bind="enableActiveClass"><slot></slot></NuxtLink>
	</object>
</template>

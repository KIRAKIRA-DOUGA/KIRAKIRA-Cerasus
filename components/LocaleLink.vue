<script setup lang="ts">
	const props = defineProps<{
		to: string;
		linkInLink?: boolean;
		activable?: boolean;
	}>();

	const localePath = useLocalePath();
	const parentScopeId = useParentScopeId();

	const attr = computed(() => {
		const attr = { ...useAttrs() };
		if (!props.activable) Object.assign(attr, { activeClass: " ", exactActiveClass: " " }); // enableActiveClass
		if (props.linkInLink && parentScopeId) attr[parentScopeId] = "";
		return attr;
	});
</script>

<template>
	<NuxtLink v-if="!linkInLink" :to="localePath(to)" v-bind="attr"><slot></slot></NuxtLink>
	<object v-else>
		<NuxtLink :to="localePath(to)" v-bind="attr"><slot></slot></NuxtLink>
	</object>
</template>

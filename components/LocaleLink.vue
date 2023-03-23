<script setup lang="ts">
	const props = defineProps<{
		to: string;
		linkInLink?: boolean;
		activable?: boolean;
	}>();

	const localePath = useLocalePath();
	const parentScopeId = useParentScopeId();

	const attr = computed(() => {
		const attr = { abcdefg: "1234567" } as Record<string, string>;
		if (props.activable) Object.assign(attr, { activeClass: " ", exactActiveClass: " " }); // enableActiveClass
		if (props.linkInLink && parentScopeId) attr[parentScopeId] = "";
		if (props.linkInLink) console.log(attr);
	});
</script>

<template>
	<NuxtLink v-if="!linkInLink" :to="localePath(to)" v-bind="attr"><slot></slot></NuxtLink>
	<object v-else>
		<NuxtLink :to="localePath(to)" v-bind="attr"><slot></slot></NuxtLink>
	</object>
</template>

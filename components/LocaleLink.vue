<script setup lang="tsx">
	const props = defineProps<{
		to: string;
		linkInLink?: boolean;
	}>();

	const localePath = useLocalePath();
	let parent = useParent();
	while (parent && ["RouterLink", "NuxtLink", "ObjectWrapper"].includes(parent.type.name!))
		parent = parent.parent;
	const scopeId = ref<string>(parent && "__scopeId" in parent.type && parent.type.__scopeId ? parent.type.__scopeId : "");

	/**
	 * 锚点 (anchor) `<a>` 标签包装器。
	 * 为了解决 `<a>` 不能嵌套进 `<a>` 的问题。
	 * @param _props - 组件属性。
	 * @return JSX。
	 */
	const ObjectWrapper: VueJsx = (_props, { slots }) => {
		return props.linkInLink ?
			<object>{slots.default?.()}</object> :
			<>{slots.default?.()}</>;
	};
</script>

<template>
	<ObjectWrapper>
		<NuxtLink v-bind="{ ...$attrs, [scopeId]: '' }" :to="localePath(to)">
			{{ parent.type.name }}
			<slot></slot>
		</NuxtLink>
	</ObjectWrapper>
</template>

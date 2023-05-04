<script setup lang="ts">
	import Menu from "./Menu.vue";

	const props = withDefaults(defineProps<{
		icon?: string;
	}>(), {
		icon: undefined,
	});

	const emits = defineEmits<{
		(event: "click", e: MouseEvent): void;
	}>();

	const parent = useParent(Menu)!;
	const menuItem = ref<HTMLDivElement>();
	const vIndex = ref(0);

	/**
	 * 单击菜单命令事件。
	 * @param e - 鼠标点击事件。
	 */
	function onClick(e: MouseEvent) {
		parent.exposed?.hide();
		emits("click", e);
	}

	onMounted(() => {
		if (!menuItem.value) return;
		const menu = menuItem.value.parentElement!;
		const menuItems = [...menu.children].filter(item => !(item instanceof HTMLHRElement));
		const index = menuItems.indexOf(menuItem.value);
		vIndex.value = index;
	});
</script>

<template>
	<div ref="menuItem" v-ripple v-i="vIndex" class="menu-item" @click="onClick">
		<Icon v-if="icon" :name="icon" />
		<div v-else class="nuxt-icon"></div>
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.menu-item {
		@include radius-small;
		@include flex-center;
		flex-shrink: 0;
		gap: $menu-padding + 2px;
		justify-content: flex-start;
		width: max-content;
		margin: 0 $menu-padding;
		padding: 8px 16px;
		padding-left: 14px;
		color: c(gray-60);
		cursor: pointer;

		.icon {
			font-size: 20px;
		}

		&:hover {
			padding-right: 13px;
			padding-left: 17px;
			color: c(text-color);
			background-color: c(hover-color);
		}

		&:not(:hover) {
			transition-duration: 1s;
		}

		/* menu:not(:hover) & {
			opacity: 0.8;
			transition-duration: 1s;
		} */
	}
</style>

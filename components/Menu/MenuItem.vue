<script setup lang="ts">
	import Menu from "./Menu.vue";

	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon?: DeclaredIcons;
		/** 禁用？ */
		disabled?: boolean;
	}>(), {
		icon: undefined,
		disabled: false,
	});

	const emits = defineEmits<{
		click: [e: MouseEvent];
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
	<div
		ref="menuItem"
		v-ripple
		v-i="vIndex"
		class="menu-item"
		role="menuitem"
		:disabled="disabled ? '' : undefined"
		:aria-disabled="disabled"
		:tabindex="disabled ? -1 : 0"
		@click="onClick"
	>
		<Icon v-if="icon" :name="icon" />
		<div v-else class="nuxt-icon"></div>
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.menu-item {
		@include round-small;
		@include flex-center;
		flex-shrink: 0;
		gap: $menu-padding + 2px;
		justify-content: flex-start;
		width: calc(100% - 2 * $menu-padding);
		min-height: $menu-item-height;
		margin-inline: $menu-padding;
		padding-block: $menu-item-padding-block;
		padding-inline: 16px;
		padding-left: 14px;
		color: c(icon-color);
		white-space: nowrap;
		cursor: pointer;

		@include tablet {
			min-height: $menu-item-height-mobile;
			padding-block: $menu-item-padding-block-mobile;
		}

		.icon {
			font-size: 20px;
		}

		&:any-hover {
			padding-right: 13px;
			padding-left: 17px;
			color: c(text-color);
			background-color: c(hover-overlay);
		}

		&:not(:any-hover) {
			transition-duration: 1s;
		}

		&[disabled] {
			color: c(gray-40);
			pointer-events: none;
			interactivity: inert;
		}
	}
</style>

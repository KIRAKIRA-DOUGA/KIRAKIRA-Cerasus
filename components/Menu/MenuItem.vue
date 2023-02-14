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

	const parent = getParent(Menu)!;
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
		<NuxtIcon v-if="icon" :name="icon" class="icon" />
		<div v-else class="icon-placeholder"></div>
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	$icon-size: 20px;

	.menu-item {
		@include radius-small;
		@include flex-center;
		flex-shrink: 0;
		gap: $menu-padding + 2px;
		justify-content: flex-start;
		width: max-content;
		height: 36px; // TODO: 强行指定菜单项目高度可以临时用来解决跳动问题，解决高度动画跳动问题后去掉这个。
		margin: 0 $menu-padding;
		padding: 8px 16px 8px 14px;
		cursor: pointer;

		.icon {
			color: c(icon-color);
			font-size: $icon-size;
		}

		.icon,
		.icon-placeholder {
			@include square($icon-size);
		}

		&:hover {
			padding-right: 14px;
			padding-left: 16px;
			background-color: c(text-color, 5%);
		}

		&:not(:hover) {
			transition-duration: 1s;
		}
	}
</style>

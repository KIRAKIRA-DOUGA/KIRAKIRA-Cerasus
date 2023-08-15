<docs>
	# 视频控制栏浮出菜单
</docs>

<script setup lang="ts">
	const emits = defineEmits<{
		show: [];
		hide: [];
	}>();

	const model = defineModel<MenuModel>();
	const shown = ref(false);
	const locationStyle = ref<CSSProperties>({});

	/**
	 * 隐藏菜单。
	 */
	function hide() {
		shown.value = false;
		model.value = undefined;
		emits("hide");
	}

	/**
	 * 显示菜单。
	 * @param e - 如有鼠标事件则为上下文菜单，否则为弹出式菜单。
	 */
	function show(e: NonNull<MenuModel>) {
		const relativeEl = getPath(e).find(element => getComputedStyle(element).position === "relative");
		if (!relativeEl) return;
		const scrollEl = getPath(e).find(element => element.scrollTop);
		const { scrollLeft, scrollTop } = scrollEl ?? { scrollLeft: 0, scrollTop: 0 };
		const { left: relativeLeft, top: relativeTop, bottom: relativeBottom } = relativeEl.getBoundingClientRect();
		const el = e.currentTarget as HTMLElement;
		const { left: clientX, top: clientY } = el.getBoundingClientRect();
		const top = relativeBottom - (clientY - relativeTop + scrollTop), left = clientX - relativeLeft + scrollLeft;
		const style = getLocationStyle([left, top]);
		style.bottom = style.top;
		style.top = undefined;
		locationStyle.value = style;
		shown.value = true;
		emits("show");
	}

	watch(model, e => {
		if (!e) hide();
		else show(e);
	}, { immediate: true });
</script>

<template>
	<Transition>
		<Comp v-if="shown" role="menu" :style="locationStyle">
			<menu @contextmenu.prevent>
				<slot></slot>
			</menu>
			<slot name="slider"></slot>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	$width: 400px;

	:comp {
		position: absolute;
	}

	menu {
		@include round-large;
		@include dropdown-flyouts;
		z-index: 70;
		width: $width;
		margin: 0;
		padding: $menu-padding 0;
		overflow: hidden;
		background-color: c(main-bg, 50%);
		
		&:empty {
			display: none;
		}
		
		+ * {
			margin-top: 1rem;
		}
	}
</style>

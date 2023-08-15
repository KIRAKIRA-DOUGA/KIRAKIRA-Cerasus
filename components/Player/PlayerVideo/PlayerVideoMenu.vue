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
	/** 指定在鼠标移出区域多久后自动隐藏。 */
	const WAITING = 1000;
	const hideTimeoutId = ref<NodeJS.Timeout>();
	/** 在请求关闭本组件的所有实例时，要求本实例不得关闭。 */
	const exceptMe = ref(false);
	/** 视频播放器控制栏中 SoftButton 的水波纹半径与容器半径之差。 */
	const X_OFFSET = 12;

	/**
	 * 隐藏菜单。
	 */
	function hide() {
		shown.value = false;
		model.value = undefined;
		emits("hide");
	}

	/**
	 * 鼠标移出区域，超时后自动关闭。
	 */
	function moveout() {
		hideTimeoutId.value = setTimeout(hide, WAITING);
	}

	/**
	 * 鼠标移入区域，取消自动关闭。
	 */
	function reshow() {
		clearTimeout(hideTimeoutId.value);
		hideTimeoutId.value = undefined;
	}

	/**
	 * 显示菜单。
	 * @param e - 如有鼠标事件则为上下文菜单，否则为弹出式菜单。
	 */
	function show(e: NonNull<MenuModel>) {
		exceptMe.value = true;
		useEvent("component:hideAllPlayerVideoMenu");
		exceptMe.value = false;
		const relativeEl = getPath(e).find(element => getComputedStyle(element).position === "relative");
		if (!relativeEl) return;
		reshow();
		const { right: relativeRight, bottom: relativeBottom } = relativeEl.getBoundingClientRect();
		const el = e.currentTarget as HTMLElement;
		const { right: targetRight, top: targetTop } = el.getBoundingClientRect();
		const bottom = relativeBottom - targetTop, right = relativeRight - targetRight - X_OFFSET;
		locationStyle.value = { right: right + "px", bottom: bottom + "px" };
		shown.value = true;
		emits("show");
	}

	useListen("component:hideAllPlayerVideoMenu", () => {
		if (!exceptMe.value) hide();
	});

	watch(model, e => {
		if (!e) moveout();
		else show(e);
	}, { immediate: true });
</script>

<template>
	<Transition>
		<Comp v-if="shown" role="menu" :style="locationStyle" @mouseenter="reshow" @mouseleave="moveout">
			<menu @contextmenu.prevent>
				<slot></slot>
			</menu>
			<slot name="slider"></slot>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	$width: 235px;

	:comp {
		position: absolute;
		width: $width;
		
		&.v-enter-from,
		&.v-leave-to {
			translate: 0 20px;
			opacity: 0;
		}
		
		> :deep(*) {
			margin-bottom: 12px;
			
			&:last-child {
				margin-bottom: 10px;
			}
		}
	}

	menu {
		@include round-large;
		@include dropdown-flyouts;
		z-index: 70;
		margin: 0;
		padding: $menu-padding;
		background-color: c(acrylic-bg, 75%);
		
		&:empty {
			display: none;
		}
		
		&:deep {
			.toggle-switch {
				@include round-small;
				min-height: 36px;
				padding: 0 16px 0 8px;
				
				&:not(:has(.ripple-circle)) {
					overflow: visible;
				}
			}
		}
	}
</style>

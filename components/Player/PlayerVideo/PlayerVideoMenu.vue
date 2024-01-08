<docs>
	# 视频控制栏浮出菜单
</docs>

<script lang="ts">
	/** 在某个实例中鼠标已按下，因此暂时禁止显示其它菜单。 */
	const preventShowing = ref(false);
</script>

<script setup lang="ts">
	const emits = defineEmits<{
		show: [];
		hide: [];
	}>();

	const model = defineModel<MenuModel | number>();
	const shown = ref(false);
	const locationStyle = ref<CSSProperties>({});
	/** 指定在鼠标移出区域多久后自动隐藏。 */
	const WAITING = 1000;
	const hideTimeoutId = ref<Timeout>();
	/** 在请求隐藏本组件的所有实例时，要求本实例不得隐藏。 */
	const hideExceptMe = ref(false);
	/** 视频播放器控制栏中 SoftButton 的水波纹半径与容器半径之差。 */
	const isMouseEnter = ref(false);
	const isMouseDown = ref(false);
	const { width: menuWidth, margin } = useScssVariables().numbers;
	const isFixed = ref(false);

	/**
	 * 隐藏菜单。
	 */
	function hide() {
		if (!shown.value) return;
		shown.value = false;
		model.value = undefined;
		isMouseEnter.value = false;
		isMouseDown.value = false;
		preventShowing.value = false;
		hideExceptMe.value = false;
		emits("hide");
	}

	/**
	 * 鼠标移出区域，超时后自动隐藏。
	 */
	function moveOut() {
		isMouseEnter.value = false;
		if (!isMouseDown.value)
			hideTimeoutId.value = setTimeout(hide, WAITING);
	}

	/**
	 * 鼠标移入区域，取消自动隐藏。
	 */
	function reshow() {
		clearTimeout(hideTimeoutId.value);
		hideTimeoutId.value = undefined;
		isMouseEnter.value = true;
	}

	const CONTROLLER_HEIGHT = 36;

	/**
	 * 显示菜单。
	 * @param e - 如有鼠标事件则为上下文菜单，否则显示在屏幕正下方。
	 */
	function show(e: MenuModel | number) {
		if (preventShowing.value) return;
		hideExceptMe.value = true;
		useEvent("component:hideAllPlayerVideoMenu");
		hideExceptMe.value = false;
		if (e && typeof e === "object") {
			const relativeEl = getPath(e).find(element => getComputedStyle(element).position === "relative");
			if (!relativeEl) return;
			isFixed.value = false;
			reshow();
			const { right: relativeRight, bottom: relativeBottom } = relativeEl.getBoundingClientRect();
			const el = e.currentTarget as HTMLElement;
			const { right: targetRight, top: targetTop, width: targetWidth } = el.getBoundingClientRect();
			const bottom = relativeBottom - targetTop;
			const right = Math.max(relativeRight - targetRight - (menuWidth - targetWidth) / 2, margin);
			locationStyle.value = { right: right + "px", bottom: Math.max(bottom, CONTROLLER_HEIGHT) + "px" };
		} else {
			isFixed.value = true;
			reshow();
			const left = (window.innerWidth - menuWidth) / 2;
			locationStyle.value = { left: left + "px", bottom: CONTROLLER_HEIGHT + "px" };
			moveOut();
		}
		shown.value = true;
		isMouseEnter.value = true;
		emits("show");
	}

	/**
	 * 当指针在菜单中按下时的事件。
	 * @param _e - 指针事件。
	 */
	function pointerDown(_e: PointerEvent) {
		isMouseDown.value = true;
		preventShowing.value = true;

		const pointerUp = () => {
			isMouseDown.value = false;
			preventShowing.value = false;
			window.removeEventListener("pointerup", pointerUp);
			if (!isMouseEnter.value) moveOut();
		};
		window.addEventListener("pointerup", pointerUp);
	}

	useListen("component:hideAllPlayerVideoMenu", () => {
		if (!hideExceptMe.value) hide();
	});

	watch(model, e => {
		if (e === undefined) moveOut();
		else show(e);
	}, { immediate: true });
</script>

<template>
	<Transition>
		<Comp
			v-if="shown"
			role="menu"
			:class="{ fixed: isFixed }"
			:style="locationStyle"
			@mouseenter="reshow"
			@mouseleave="moveOut"
			@pointerdown="pointerDown"
		>
			<menu @contextmenu.prevent>
				<slot></slot>
			</menu>
			<slot name="slider"></slot>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	$width: 235px;
	$margin: 12px;

	:comp {
		position: absolute;
		width: $width;

		&.v-enter-from,
		&.v-leave-to {
			translate: 0 20px;
			opacity: 0;
		}

		> :deep(*) {
			margin-bottom: $margin;
		}

		&.fixed {
			position: fixed;
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
				padding: 0 8px;
			}
		}
	}
</style>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 内容占位符，当选中的一项不是任何一项有效的标识符时显示。 */
		placeholder?: string;
	}>(), {
		placeholder: "请选择一项",
	});

	const selected = defineModel<string>({ required: true });
	const slots = useSlots();

	const menu = ref<HTMLDivElement>();
	const vdoms = slots.default?.();
	const items = computed(() => vdoms?.map(item => {
		const props = item.props as { id?: string } | undefined;
		const content = (item.children as typeof slots).default?.()?.[0]?.children;
		if (typeof content !== "string") return undefined!;
		return { content, id: props?.id ?? content };
	}).filter(item => item) ?? []);
	const itemsLength = computed(() => items.value.length);
	const selectedIndex = computed(() => items.value.findIndex(item => item.id === selected.value && selected.value));
	const selectedContent = computed(() => items.value.find(item => item.id === selected.value)?.content);
	const selectedIndexStatic = ref(0);
	const isSelectionValid = computed(() => selectedIndex.value !== -1);

	const showMenu = ref(false);
	const show = () => {
		selectedIndexStatic.value = isSelectionValid.value ? selectedIndex.value : 0;
		showMenu.value = true;
	};
	const setItem = async (item: string) => {
		selected.value = item;
		await nextTick();
		showMenu.value = false;
	};
	const getMenuCssVars = (el: Element) => {
		const { height, menuPadding } = arrayMapObject(["height", "menuPadding"],
			i => parseFloat(useCssVar(new VariableName(i).cssVar, el as HTMLElement).value));
		const top = 0;
		const translateY = -height * selectedIndexStatic.value;
		const finalHeight = height + 2 * menuPadding;
		const clipPathTop = selectedIndexStatic.value;
		const clipPathBottom = itemsLength.value - 1 - selectedIndexStatic.value;
		const itemPercent = itemsLength.value ? 100 / itemsLength.value : 0;
		const clipPathValue = `inset(${itemPercent * clipPathTop}% 0 ${itemPercent * clipPathBottom}% round 4px)`;
		return { height, menuPadding, top, translateY, finalHeight, clipPath: clipPathValue };
	};
	const getMenuCard = (el: Element) => el.querySelector<HTMLDivElement>(".menu")!;
	const getMenuItems = (el: Element) => el.querySelector<HTMLDivElement>(".items")!;
	const clipPathUnset = { clipPath: "inset(0 round 4px)" } as const;

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuEnter(el: Element, done: () => void) {
		const { top, finalHeight, clipPath } = getMenuCssVars(el);
		await animateSize(getMenuCard(el), null, {
			startHeight: finalHeight,
			duration: 250,
			easing: eases.easeOutMax,
			withoutAdjustPadding: "both",
			startStyle: { top: `${top}px` },
			attachAnimations: [[getMenuItems(el), [{ clipPath }, clipPathUnset]]],
		});
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuLeave(el: Element, done: () => void) {
		const { top, finalHeight, clipPath } = getMenuCssVars(el);
		await animateSize(getMenuCard(el), null, {
			endHeight: finalHeight,
			duration: 100,
			easing: eases.linear,
			withoutAdjustPadding: "both",
			endStyle: { top: `${top}px` },
			attachAnimations: [[getMenuItems(el), [clipPathUnset, { clipPath }]]],
		});
		done();
	}

	useEventListener("window", "pointerdown", e => {
		if (!menu.value || !showMenu.value) return;
		const clickOutside = !isInPath(e, menu);
		if (clickOutside) showMenu.value = false;
	});
</script>

<template>
	<Comp role="combobox" :aria-expanded="showMenu">
		<div>
			<!-- TODO: 缺少字段图标与标签以与输入框样式匹配。注意是整个字段的图标，不是每个项目的图标。 -->
			<div v-ripple class="wrapper" :tabindex="0" @click="show">
				<span v-if="isSelectionValid">{{ selectedContent }}</span>
				<span v-else class="placeholder">{{ placeholder }}</span>
				<Icon name="chevron_down" />
			</div>
			<Transition :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
				<div v-if="showMenu" ref="menu">
					<div class="menu">
						<div v-for="item in items" :key="item.id" class="item-shadow"></div>
					</div>
					<div class="items">
						<div
							v-for="item in items"
							:key="item.id"
							v-ripple
							class="item"
							:class="{ active: item.id === selected }"
							@click="setItem(item.id)"
						>
							<span>{{ item.content }}</span>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$normal-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$start-indent: 12px;

	@layer props {
		:comp {
			/// 组合框尺寸，可选的值为：small | normal | large。
			--size: normal;
		}
	}

	:comp {
		position: relative;

		> * {
			--height: #{$normal-height};
			--menu-padding: #{$menu-padding};

			@container style(--size: small) {
				--height: #{$small-height};
			}

			@container style(--size: large) {
				--height: #{$large-height};
			}
		}
	}

	.wrapper {
		@include round-large;
		@include chip-shadow;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--height);
		padding: 0 $start-indent;
		color: c(text-color);
		background-color: c(main-bg);
		cursor: pointer;

		.placeholder {
			color: c(icon-color);
		}

		.icon {
			margin-right: -6px;
			color: c(icon-color);
			font-size: 24px;
		}

		&:active {
			background-color: c(main-bg);
			box-shadow: none !important;

			.icon {
				translate: 0 2px;
			}
		}

		&:focus {
			@include button-shadow-unchecked-focus;
		}

		&:any-hover {
			@include button-shadow-unchecked-hover;
			background-color: c(gray-5);
		}

		&:any-hover:focus {
			@include button-shadow-unchecked-hover-focus;
		}
	}

	.menu,
	.items {
		top: calc(0px - v-bind(selectedIndexStatic) * var(--height));
	}

	.menu {
		@include dropdown-flyouts;
		@include round-large;
		position: absolute;
		z-index: 70;
		width: calc(100% + 2 * $menu-padding);
		margin: (-$menu-padding) (-$menu-padding);
		padding: $menu-padding 0;
		overflow: hidden;
		color: c(text-color);
		background-color: c(main-bg);

		.item-shadow {
			height: var(--height);
		}

		&:not(:hover, :active) {
			@include dropdown-flyouts-unhover;
			transition: $fallback-transitions, box-shadow 1s, opacity 1s;
		}
	}

	.items {
		position: absolute;
		z-index: 71;
		width: 100%;

		.item {
			@include round-small;
			position: relative;
			display: flex;
			align-items: center;
			height: var(--height);
			padding: 0 $start-indent;
			cursor: pointer;

			&:hover {
				background-color: c(hover-color);
			}

			&.active {
				background-color: c(hover-color);

				&::before {
					@include oval;
					position: absolute;
					left: 0;
					z-index: 3;
					width: 3px;
					height: 16px;
					background-color: c(accent);
					animation: show-indicator 250ms $ease-out-max;
					content: "";
				}

				&:active:hover::before {
					height: 10px;
				}
			}
		}
	}

	@keyframes show-indicator {
		from {
			height: 0;
		}
	}
</style>

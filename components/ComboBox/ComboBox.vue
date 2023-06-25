<script setup lang="ts">
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
	const selectedIndex = computed(() => items.value.findIndex(item => item.id === selected.value && selected.value));
	const selectedContent = computed(() => items.value.find(item => item.id === selected.value)?.content);
	const selectedIndexStatic = ref(0);

	const showMenu = ref(false);
	const show = () => {
		selectedIndexStatic.value = selectedIndex.value;
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
		return { height, menuPadding, top, translateY, finalHeight };
	};

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onMenuEnter(el: Element, done: () => void) {
		const { top, translateY, finalHeight } = getMenuCssVars(el);
		await animateSize(el, null, {
			startHeight: finalHeight,
			duration: 250,
			removeChildGlitchFrame: true,
			easing: eases.easeOutMax,
			withoutAdjustPadding: "both",
			startChildTranslate: `0 ${translateY}px`,
			startStyle: { top: `${top}px` },
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
		const { top, translateY, finalHeight } = getMenuCssVars(el);
		await animateSize(el, null, {
			endHeight: finalHeight,
			duration: 100,
			easing: eases.linear,
			withoutAdjustPadding: "both",
			endChildTranslate: `0 ${translateY}px`,
			endStyle: { top: `${top}px` },
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
			<div v-ripple class="wrapper" :tabindex="0" @click="show">
				<span>{{ selectedContent }}</span>
				<Icon name="chevron_down" />
			</div>
			<Transition :css="false" @enter="onMenuEnter" @leave="onMenuLeave">
				<div v-if="showMenu" ref="menu" class="menu">
					<div>
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
		@include radius-large;
		@include chip-shadow;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--height);
		padding: 0 $start-indent;
		color: c(text-color);
		background-color: c(main-bg);
		cursor: pointer;

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

		@media (any-hover: hover) {
			&:hover {
				@include button-shadow-unchecked-hover;
				background-color: c(gray-20);
			}

			&:hover:focus {
				@include button-shadow-unchecked-hover-focus;
			}
		}
	}

	.menu {
		@include dropdown-flyouts;
		@include radius-large;
		position: absolute;
		top: calc(0px - v-bind(selectedIndexStatic) * var(--height));
		z-index: 70;
		width: calc(100% + 2 * $menu-padding);
		margin: (-$menu-padding) (-$menu-padding);
		padding: $menu-padding 0;
		overflow: hidden;
		color: c(text-color);
		background-color: c(main-bg);
			
		> * {
			position: relative;
		}

		.item {
			@include radius-small;
			position: relative;
			display: flex;
			align-items: center;
			height: var(--height);
			margin: 0 $menu-padding;
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

		&:not(:hover, :active) {
			@include dropdown-flyouts-unhover;
			transition: $fallback-transitions, box-shadow 1s, opacity 1s;
		}
	}
	
	@keyframes show-indicator {
		from {
			height: 0;
		}
	}
</style>

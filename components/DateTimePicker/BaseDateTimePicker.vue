<docs>
	# 日期/时间/时间码选择器的基础选择器
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 基础日期时间选择器字段。 */
		fields: (BaseDateTimePickerField | BaseDateTimePickerFieldPlain)[];
		/** 缺省分隔符。默认为间隔号。 */
		defaultSep?: string;
	}>(), {
		defaultSep: "·",
	});

	const { menuItemCount, itemHeight } = useScssVariables().numbers;
	const model = defineModel<Record<string, Readable>>();
	const emit = defineEmits<{
		open: [];
		confirm: [];
		cancel: [];
	}>();
	const showMenu = ref<DOMRect>();
	const menu = ref<HTMLElement>();
	const previousValue = ref<Record<string, Readable>>();
	const menuValuesKeys = ["noumenon", "shadow"] as const;
	const menuValues = reactive<Record<ValueOf<typeof menuValuesKeys>, Record<string, HTMLDivElement | undefined | null>>>(arrayMapObjectConst(menuValuesKeys, () => ({})));
	const buttonEl = ref<InstanceType<typeof Comp>>();
	const buttonElSizeObserver = ref<ResizeObserver>();
	const dash = "‒" as const;
	const widthChangingTransitionTimeoutId = ref<Timeout>();
	const displayFields = computed(() => props.fields.filter(field => !("text" in field) || toValue(field.text) !== ""));

	function getFieldText(field: BaseDateTimePickerField | BaseDateTimePickerFieldPlain) {
		if ("text" in field) return toValue(field.text);
		const value = model.value == null ? field.placeholderValue : model.value[field.name];
		if (value == null) return dash.repeat(field.placeholderLength ?? 2);
		return field.getDisplayValue?.(value) ?? value;
	}

	function openMenu(e: MouseEvent) {
		previousValue.value = model.value;
		emit("open");
		showMenu.value = (e.currentTarget as HTMLElement).getBoundingClientRect();
	}

	function confirmSelection() {
		showMenu.value = undefined;
		emit("confirm");
	}

	function cancelSelection() {
		if (previousValue.value)
			model.value = previousValue.value;
		showMenu.value = undefined;
		emit("cancel");
	}

	useEventListener("window", "pointerdown", e => {
		if (!menu.value || !showMenu.value) return;
		const clickOutside = !isInPath(e, menu);
		if (clickOutside) cancelSelection();
	});

	useEventListener("window", "keydown", e => {
		if (showMenu.value && e.key === "Escape") cancelSelection();
	});

	const visibleValues = computed(() => arrayMapObject(props.fields.filter(field => !("text" in field)) as BaseDateTimePickerField[], ({ name, values, loopable }) => {
		if (typeof values === "function") values = values();
		const currentValue = model.value?.[name];
		const currentIndex = currentValue === undefined ? 0 : Math.max(0, values.indexOf(currentValue));
		const result: Readable[] = [];
		for (let i = currentIndex - (menuItemCount - 1); i <= currentIndex + (menuItemCount - 1); i++) {
			const index = loopable ? floorMod(i, values.length) : i;
			const value = values[index];
			result.push(value);
		}
		return [name, result];
	}));

	function setField(name: string, value: Readable) {
		model.value = { ...model.value, [name]: value };
	}

	function onWheel(e: WheelEvent, fieldName: string) {
		const offset = e.deltaY > 0 ? 1 : -1;
		const nextValue = visibleValues.value[fieldName][menuItemCount - 1 + offset];
		if (nextValue !== undefined) {
			setField(fieldName, nextValue);
			spining(fieldName, offset);
		}
	}

	const getOffsetFromIndex = (index: number) => index - menuItemCount + 1;

	async function spining(fieldName: string, offset: number) {
		await nextTick();
		const fields = menuValuesKeys.map(key => menuValues[key][fieldName]).filter(Boolean) as HTMLDivElement[];
		if (fields.length === 0 || !offset || isPrefersReducedMotion()) return;
		removeExistAnimations(...fields);
		await Promise.all(fields.map(field => field.animate({
			translate: [`0 ${offset * itemHeight}px`, ""],
		}, {
			duration: 250,
			easing: eases.easeOutMax,
		}).finished.catch(useNoop)));
	}

	onMounted(() => {
		const WIDTH_CHANGING = "width-changing";
		buttonElSizeObserver.value = new ResizeObserver(([{ target }]) => {
			menu.value?.classList.add(WIDTH_CHANGING);
			showMenu.value &&= target.getBoundingClientRect();
			clearTimeout(widthChangingTransitionTimeoutId.value);
			widthChangingTransitionTimeoutId.value = setTimeout(() => menu.value?.classList.remove(WIDTH_CHANGING), 250);
		});
		if (buttonEl.value) buttonElSizeObserver.value.observe(buttonEl.value.$el);
	});

	onUnmounted(() => {
		buttonElSizeObserver.value?.disconnect();
	});
</script>

<template>
	<Comp
		ref="buttonEl"
		role="application"
		v-ripple
		:aria-expanded="!!showMenu"
		tabindex="0"
		@click="openMenu"
	>
		<template v-for="(field, index) in displayFields" :key="field.name">
			<p class="value" :style="{ minWidth: toValue(field.minWidth) }">{{ getFieldText(field) }}</p>
			<p v-if="(field.sep || defaultSep) && index < displayFields.length - 1" class="sep">{{ field.sep || defaultSep }}</p>
		</template>
		<ClientOnlyTeleport to="#popovers">
			<Transition :duration="{ enter: 250, leave: 125 }">
				<div
					v-if="showMenu && model"
					ref="menu"
					class="menu"
					:style="{
						'--left': showMenu.left + 'px',
						'--top': showMenu.top + 'px',
						'--width': showMenu.width + 'px',
					}"
				>
					<div class="base"></div>
					<div class="content">
						<div class="highlight"></div>
						<div v-for="key in menuValuesKeys" :key="key" class="items" :class="key">
							<template v-for="({ name, sep, minWidth, ...field }, index) in fields" :key="name">
								<div v-if="'values' in field" :ref="el => menuValues[key][name] = el as HTMLDivElement" class="values" :style="{ minWidth: toValue(minWidth) }" @wheel="e => onWheel(e, name)">
									<!-- 虽说不推荐将数组索引值作为 key，但是假如元素太少（例如12小时制），则会出现一轮包含多个相同的 key，从而导致出现异常。 -->
									<template v-for="(value, i) in visibleValues[name]" :key="getOffsetFromIndex(i)">
										<p v-if="value !== undefined" v-ripple class="item" @click="setField(name, value); spining(name, getOffsetFromIndex(i))">
											{{ field.getDisplayValue?.(value) ?? value }}
										</p>
										<p v-else class="item nothing"></p>
									</template>
								</div>
								<p v-else-if="String(toValue(field.text))" class="plain" :style="{ minWidth: toValue(minWidth) }">{{ toValue(field.text) }}</p>
								<p v-if="(sep || defaultSep) && index < fields.length - 1" class="sep">{{ sep || defaultSep }}</p>
							</template>
						</div>
						<div class="buttons">
							<button v-ripple @click="cancelSelection"><Icon name="close" /></button>
							<button v-ripple @click="confirmSelection"><Icon name="check" /></button>
						</div>
					</div>
				</div>
			</Transition>
		</ClientOnlyTeleport>
	</Comp>
</template>

<style scoped lang="scss">
	$item-height: 36px;
	$menu-item-count: 9;
	$menu-bottom-buttons-height: 42px;
	$menu-padding-inline: 4px;
	$item-padding-inline: 16px;
	$item-gap: calc(9px / 2);

	:comp {
		@include chip-shadow;
		@include round-large;
		display: flex;
		justify-content: space-evenly;
		align-items: stretch;
		width: fit-content;
		height: $item-height;
		padding-inline: $item-padding-inline;
		background-color: c(main-bg);

		&:active {
			background-color: c(main-bg);
			box-shadow: none !important;
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

		p {
			@extend %item-value;
			padding-inline: $item-gap;
		}
	}

	* {
		font-weight: 500;
		font-feature-settings: "case" on; // 使冒号和负号等与数字和大写字母等高（不需要比号）。
		font-variant-numeric: tabular-nums;
	}

	.sep {
		align-content: center;
		align-self: center;
		opacity: 0.5;
	}

	%item-value {
		align-content: center;
		color: c(icon-color);
		text-align: center;
	}

	.menu {
		$width: calc(var(--width) + $menu-padding-inline * 2);
		$height: $item-height * $menu-item-count + $menu-bottom-buttons-height;
		$half-items-height: $item-height * math.floor(calc($menu-item-count / 2));
		--top-value: clamp(0px, calc(var(--top) - #{$half-items-height}), calc(100dvh - #{$height}));
		--left-value: clamp(0px, calc(var(--left) - #{$menu-padding-inline}), calc(100dvw - #{$width}));
		top: var(--top-value);
		left: var(--left-value);
		width: $width;
		height: $height;

		// 使用绝对定位而不是和 ComboBox 一样的相对定位是因为，我想到一个用例是视频跳时间。要是用相对定位的话，如果视频全屏显示，那么必然会有半边菜单显示在屏幕之外。
		> * {
			position: fixed;
			top: var(--top-value);
			left: var(--left-value);
			width: $width;
			height: $height;
		}

		.base {
			@include dropdown-flyouts;
			@include round-large;
			background-color: c(main-bg);
		}

		.content {
			@include round-large;
			overflow: hidden;
			clip-path: inset(0);
		}

		.items {
			display: flex;
			justify-content: space-evenly;
			align-items: stretch;
			width: 100%;
			height: $item-height * $menu-item-count;
			padding-inline: $item-padding-inline + $menu-padding-inline;
			overflow-y: clip;
			mask: linear-gradient(
				to bottom,
				transparent 0%,
				black calc(100% / $menu-item-count),
				black calc(100% - 100% / $menu-item-count),
				transparent 100%,
			);

			.item {
				@include round-small;
				@extend %item-value;
				position: relative;
				height: $item-height;
				margin-inline: -$item-gap;
				padding-inline: $item-gap * 2;
				white-space: nowrap;
				cursor: pointer;

				&:any-hover {
					background-color: c(hover-overlay);
				}

				&.nothing {
					pointer-events: none;
				}
			}

			.values {
				height: $item-height * ($menu-item-count * 2 - 1);
				margin-top: -$half-items-height;
				padding-inline: 0;
			}

			&.shadow {
				position: absolute;
				top: 0;
				z-index: 2;
				pointer-events: none;
				interactivity: inert;
				clip-path: inset($half-items-height 0);

				.sep,
				.plain,
				.item {
					color: c(main-bg);
				}
			}

			&:not(.shadow) {
				.sep,
				.plain {
					visibility: hidden;
				}
			}

			.plain {
				@extend %item-value;
				align-self: center;
				white-space: nowrap;
			}

			> * {
				padding-inline: $item-gap;
			}
		}

		.buttons {
			@include card-shadow;
			z-index: 1;
			display: flex;
			align-items: stretch;
			height: $menu-bottom-buttons-height;
			background-color: c(main-bg);

			button {
				@include grid-center;
				width: 100%;
				color: c(icon-color);
				font-size: 24px;

				&:any-hover {
					background-color: c(hover-overlay);
				}
			}
		}

		.highlight {
			@include button-shadow;
			@include round-small;
			position: absolute;
			top: $half-items-height;
			left: $menu-padding-inline;
			z-index: 1;
			width: var(--width);
			height: $item-height;
			background-color: c(accent);
			pointer-events: none;
		}

		&.v-enter-from,
		&.v-leave-to {
			.base {
				top: var(--top);
				height: $item-height;
			}

			.highlight {
				opacity: 0;
			}

			.item,
			.sep {
				color: c(icon-color) !important;
			}

			* {
				pointer-events: none;
			}

			.content {
				translate: 0 calc((var(--top) - #{$half-items-height}) - var(--top-value));
				clip-path: inset($half-items-height 0 ($half-items-height + $menu-bottom-buttons-height));
			}

			.items.shadow .plain {
				color: c(icon-color);
			}
		}

		&.width-changing .values {
			overflow-x: hidden;
		}
	}
</style>

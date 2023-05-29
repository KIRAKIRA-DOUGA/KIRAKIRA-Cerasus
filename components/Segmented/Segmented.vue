<script setup lang="ts">
	const selected = defineModel<string>({ required: true });
	const slots = useSlots(); /* defineSlots<{
		default?: typeof SegmentedItem;
	}>(); */
	const vdoms = slots.default?.();
	const items = computed(() => vdoms?.map(item => {
		const props = item.props as { id?: string; icon?: string } | undefined;
		const caption = (item.children as typeof slots).default?.()?.[0]?.children;
		if (typeof caption !== "string") return undefined!;
		return { caption, id: props?.id ?? caption, icon: props?.icon };
	}).filter(item => item) ?? []);
	const count = computed(() => items.value.length);
	const displaySelectedIndex = ref<number>();
	const selectedIndex = computed(() => displaySelectedIndex.value ?? items.value.findIndex(item => item.id === selected.value && selected.value));

	/**
	 * 拖拽滑块。
	 * @param e - 指针事件。
	 */
	function onDrag(e: PointerEvent) {
		let thumb = e.target as HTMLDivElement;
		while (!thumb || !thumb.classList.contains("thumb"))
			thumb = thumb.parentElement as HTMLDivElement;
		if (!thumb) return;
		const trackItems = thumb.parentElement?.querySelector(".track")?.children;
		const _items = items.value;
		if (!trackItems?.length || !_items.length) return;
		forceCursor("grabbing");
		const lefts = [...trackItems].map(item => item.getBoundingClientRect().left);
		const pointerMove = (e: PointerEvent) => {
			const x = e.pageX;
			for (let i = lefts.length - 1; i >= 0; i--)
				if (x >= lefts[i]) {
					displaySelectedIndex.value = i;
					return;
				}
			displaySelectedIndex.value = 0;
		};
		const pointerUp = () => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			forceCursor(null);
			if (displaySelectedIndex.value !== undefined)
				selected.value = _items[displaySelectedIndex.value].id;
			displaySelectedIndex.value = undefined;
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}
</script>

<template>
	<Comp>
		<div class="track">
			<div v-for="item in items" :key="item.id" v-ripple class="item" @click="selected = item.id">
				<Icon v-if="item.icon" :name="item.icon" />
				<span>{{ item.caption }}</span>
			</div>
		</div>
		<div v-show="count > 0" v-ripple class="thumb" @pointerdown="onDrag">
			<div>
				<div v-for="(item, i) in items" :key="item.id" :style="{ '--i': i }" class="item">
					<Icon v-if="item.icon" :name="item.icon" />
					<span>{{ item.caption }}</span>
				</div>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$height: 36px;

	:comp {
		position: relative;
		width: fit-content;
	}

	.track {
		@include control-inner-shadow;
		@include radius-small;
		position: relative;
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		width: fit-content;
		height: $height;
		background-color: c(inset-bg);

		> .item {
			color: c(icon-color);
			cursor: pointer;
		}
	}

	.item {
		@include flex-center;
		@include radius-small;
		gap: 6px;
		padding: 0 11px;

		@media (any-hover: hover) {
			&:hover {
				background: c(hover-color);
			}
		}

		.icon {
			margin-left: -2px;
			font-size: 24px;
		}
	}

	.thumb {
		@include page-active;
		@include radius-small;
		--width: calc(100% / v-bind(count));
		position: absolute;
		top: 0;
		left: calc(var(--width) * v-bind(selectedIndex));
		z-index: 3;
		width: var(--width);
		height: 100%;
		overflow: hidden;
		font-weight: bold;
		background-color: c(accent);
		cursor: grab;
		transition: $fallback-transitions, all $ease-out-back 500ms, left $ease-out-smooth 500ms;

		@media (any-hover: hover) {
			&:hover {
				@include button-shadow-hover;
				background: c(accent-hover);

				&:has(:focus) {
					@include button-shadow-hover-focus;
				}
			}
		}

		&:active {
			@include button-scale-pressed;
			background: c(accent);
			cursor: grabbing;
		}

		> div {
			position: relative;
			height: 100%;
			translate: calc(-100% * v-bind(selectedIndex));
			transition: $fallback-transitions, all $ease-out-back 500ms, translate $ease-out-smooth 500ms;
			// TODO: 在滑块移动动画时，滑块内部元素会抖动，暂不知如何解决。另外运动曲线也与页面切换器不相匹配，如强制使用则会使抖动更加明显。

			> .item {
				@include square(100%);
				position: absolute;
				left: calc(100% * var(--i));
				color: white;
				white-space: nowrap;
			}
		}
	}
</style>

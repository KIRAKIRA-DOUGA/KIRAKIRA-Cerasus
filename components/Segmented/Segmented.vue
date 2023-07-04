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
	const selectedInvalid = computed(() => selectedIndex.value === -1);
	const selectedCaption = computed(() => items.value.find(item => item.id === selected.value)?.caption);
	const pressed = ref(false); // 为了兼容触摸屏，触摸屏在滑动时会撤销 active 伪类。

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
		pressed.value = true;
		forceCursor("grabbing");
		const lefts = Array.from(trackItems, item => item.getBoundingClientRect().left);
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
			pressed.value = false;
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
	<Comp
		:class="{ invalid: selectedInvalid }"
		role="radiogroup"
		:aria-details="t.selected_item_label + selectedCaption"
		aria-orientation="horizontal"
	>
		<div class="track items-wrapper">
			<div
				v-for="item in items"
				:key="item.id"
				v-ripple
				class="item"
				role="radio"
				:aria-checked="selected === item.id"
				:aria-current="selected === item.id"
				@click="selected = item.id"
			>
				<Icon v-if="item.icon" :name="item.icon" />
				<span>{{ item.caption }}</span>
			</div>
		</div>
		<div
			v-show="count > 0"
			v-ripple
			class="thumb"
			:class="{ pressed }"
			@pointerdown="onDrag"
		></div>
		<div class="content items-wrapper">
			<div
				v-for="item in items"
				:key="item.id"
				class="item"
				role="radio"
				:aria-checked="selected === item.id"
				:aria-current="selected === item.id"
			>
				<Icon v-if="item.icon" :name="item.icon" />
				<span>{{ item.caption }}</span>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$height: 36px;
	$duration: 500ms;

	:comp {
		position: relative;
		width: fit-content;
	}

	.track {
		@include control-inner-shadow;
		@include round-small;
		position: relative;
		background-color: c(inset-bg);

		> .item {
			color: c(icon-color);
			cursor: pointer;
		}
	}

	.item {
		@include flex-center;
		@include round-small;
		gap: 6px;
		padding: 0 11px;

		&:any-hover {
			background: c(hover-color);
		}

		.icon {
			margin-left: -2px;
			font-size: 24px;
		}
	}

	.items-wrapper {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		width: fit-content;
		height: $height;
	}

	.content {
		position: absolute;
		top: 0;
		z-index: 4;
		color: white;
		transition: $fallback-transitions, clip-path $ease-in-out-smooth $duration;
		clip-path: inset(0% calc((1 - (v-bind(selectedIndex) + 1) / v-bind(count)) * 100%) 0% calc(v-bind(selectedIndex) / v-bind(count) * 100%) round 4px);
		pointer-events: none;

		.thumb:is(.pressed, :active) + & {
			transition: $fallback-transitions, clip-path $ease-out-smooth $duration, opacity $ease-in-out-smooth $duration;
		}

		:comp.invalid & {
			opacity: 0;
		}
	}

	.thumb {
		@include page-active;
		@include round-small;
		$transition: $fallback-transitions, all $ease-out-back $duration;
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
		transition: $transition, left $ease-in-out-smooth $duration, opacity $ease-in-out-smooth $duration;
		touch-action: pan-y pinch-zoom;

		&:any-hover {
			@include button-shadow-hover;
			background: c(accent-hover);

			&:has(:focus) {
				@include button-shadow-hover-focus;
			}
		}

		&:active {
			@include button-scale-pressed;
			background: c(accent);
			cursor: grabbing;
		}

		&:is(.pressed, :active) {
			transition: $transition, left $ease-out-smooth $duration;
		}

		:comp.invalid & {
			opacity: 0;
			pointer-events: none;
		}
	}
</style>

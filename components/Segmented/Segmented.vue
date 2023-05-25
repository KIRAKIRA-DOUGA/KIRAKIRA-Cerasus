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
	const selectedIndex = computed(() => items.value.findIndex(item => item.id === selected.value && selected.value));
	// TODO: 缺少拖拽滑块功能。
</script>

<template>
	<Comp>
		<div class="track">
			<div v-for="item in items" :key="item.id" v-ripple class="item" @click="selected = item.id">
				<Icon v-if="item.icon" :name="item.icon" />
				<span>{{ item.caption }}</span>
			</div>
		</div>
		<div v-ripple class="thumb">
			<div>
				<div v-for="(item, i) in items" :key="item.id" v-ripple v-i="i" class="item">
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
		transition: $fallback-transitions, all $ease-out-back 500ms, left $ease-in-out-smooth 500ms;

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
			transition: $fallback-transitions, all $ease-out-back 500ms, translate $ease-in-out-smooth 500ms;

			> .item {
				position: absolute;
				left: calc(100% * var(--i));
				height: 100%;
				color: white;
				white-space: nowrap;
			}
		}
	}
</style>

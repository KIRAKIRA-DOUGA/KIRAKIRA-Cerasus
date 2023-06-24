<script setup lang="ts">
	const selected = defineModel<string>({ required: true });
	const slots = useSlots();

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
		showMenu.value = true;
		selectedIndexStatic.value = selectedIndex.value;
	};
	const setItem = (item: string) => {
		selected.value = item;
		showMenu.value = false;
	};
</script>

<template>
	<Comp role="combobox">
		<div v-ripple class="wrapper" @click="show">
			<span>{{ selectedContent }}</span>
			<Icon name="chevron_down" />
		</div>
		<Transition>
			<div v-if="showMenu" class="menu">
				<div v-for="item in items" :key="item.id" v-ripple class="item" @click="setItem(item.id)">
					<span>{{ item.content }}</span>
				</div>
			</div>
		</Transition>
	</Comp>
</template>

<style scoped lang="scss">
	$default-height: 36px;
	$small-height: 28px;
	$large-height: 44px;
	$start-indent: 12px;

	:comp {
		position: relative;
	}
	
	.wrapper {
		@include radius-large;
		@include chip-shadow;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: $default-height;
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
		--top: calc(#{$menu-padding - $default-height / 2} + v-bind(selectedIndexStatic) * #{$default-height});
		position: absolute;
		top: calc(0px - $menu-padding - v-bind(selectedIndexStatic) * $default-height);
		z-index: 70;
		width: 100%;
		padding: $menu-padding 0;
		color: c(text-color);
		background-color: c(main-bg);
		// clip-path: inset(0);
		
		.item {
			@include radius-small;
			display: flex;
			align-items: center;
			height: $default-height;
			margin: 0 $menu-padding;
			padding: 0 calc($start-indent - $menu-padding);
			cursor: pointer;
			
			&:hover {
				background-color: c(hover-color);
			}
		}
		
		&:not(:hover, :active) {
			@include dropdown-flyouts-unhover;
			transition: $fallback-transitions, box-shadow 1s, opacity 1s;
		}
		
		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
			// clip-path: inset(var(--top) 0 calc(100% - var(--top))); // TODO: 劈裂动画。
		}
	}
</style>

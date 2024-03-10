<!-- @deprecated 已弃用 -->

<docs>
	UP 主为你比🖤🖤！
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 是否不显示？ */
		hidden?: boolean;
	}>();

	const hover = ref(false);
	const [onContentEnter, onContentLeave] = simpleAnimateSize("width");
</script>

<template>
	<Transition>
		<Comp v-if="!hidden" role="text" @mouseenter="hover = true" @mouseleave="hover = false">
			<!-- 谨记：这里有个坑。要用 mouseenter 和 mouseleave，千万不要用 mouseover 和 mouseout。 -->
			<Icon name="heart" />
			<Transition :css="false" @enter="onContentEnter" @leave="onContentLeave">
				<span v-show="hover" class="text">UP主爱啦</span>
			</Transition>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		display: inline-flex;
		align-items: center;
		height: 24px;
		padding: 6px;
		color: c(accent);
		font-weight: 500;
		background-color: c(accent-10);

		.dark & {
			color: c(icon-color);
		}

		.icon {
			font-size: 16px;
		}

		.text {
			margin-left: 4px;
			overflow: clip;
			white-space: nowrap;
		}

		&.v-enter-from,
		&.v-leave-to {
			scale: 0.8;
			opacity: 0;
		}
	}
</style>

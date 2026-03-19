<docs>
	# 下拉刷新

	FIXME: 当前因为使用了TouchEvent只支持Chromium内核的浏览器，请考虑使用PointerEvent但是注意浏览器默认触摸事件的冲突问题。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 滚动容器选择器。 */
		scrollContainerSelector?: string;
		/** 滚动内容选择器。 */
		scrollContentSelector?: string;
	}>(), {
		scrollContainerSelector: "#mainScroller",
		scrollContentSelector: "#mainScroller > .content",
	});
	const refreshing = defineModel<boolean>();

	const scrollContainer = ref<HTMLElement | null>(null);
	const scrollContent = ref<HTMLElement | null>(null);
	const indicatorWrapper = ref<HTMLElement>();

	const REFRESH_THRESHOLD = 160;
	const pulling = ref(false);
	const startY = ref(0);
	const pullDistance = ref(0);
	const indicatorRotate = computed(() => {
		if (refreshing.value) return 0;
		if (pulling.value)
			return Math.max(pullDistance.value / REFRESH_THRESHOLD, 0) * 360;
		return 0;
	});
	const indicatorWrapperTranslateY = computed(() => {
		if (refreshing.value) return 32;
		if (pulling.value)
			return map(pullDistance.value, 0, REFRESH_THRESHOLD, -48, 32);
		return -48;
	});

	const onTouchMove = (e: TouchEvent) => {
		if (scrollContainer.value?.scrollTop !== 0) return;
		const currentY = e.touches[0].clientY;
		if (currentY - startY.value > 0) {
			pulling.value = true;
			pullDistance.value = currentY - startY.value;
			if (indicatorWrapper.value) indicatorWrapper.value.style.transition = "unset";
			scrollContent.value!.style.translate = `0 ${pullDistance.value / 2}px`;
			scrollContent.value!.style.transition = "unset";
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		if (scrollContainer.value?.scrollTop !== 0) return;
		startY.value = e.touches[0].clientY;
		scrollContainer.value?.addEventListener("touchmove", onTouchMove as EventListener);
	};

	const onTouchEnd = () => {
		if (pulling.value && pullDistance.value >= REFRESH_THRESHOLD) {
			refreshing.value = true;
			setTimeout(() => {
				refreshing.value = false;
			}, 1000); // 模拟刷新延迟
		}
		pulling.value = false;
		pullDistance.value = 0;
		if (indicatorWrapper.value) indicatorWrapper.value.style.transition = "";
		scrollContent.value!.style.translate = "";
		scrollContent.value!.style.transition = `translate 1s ${eases.easeOutSpringSnap}`;
		scrollContainer.value?.removeEventListener("touchmove", onTouchMove as EventListener);
	};

	onMounted(() => {
		scrollContainer.value = document.querySelector(props.scrollContainerSelector);
		scrollContent.value = document.querySelector(props.scrollContentSelector);
		scrollContainer.value?.addEventListener("touchstart", onTouchStart as EventListener);
		scrollContainer.value?.addEventListener("touchend", onTouchEnd as EventListener);
	});

	onBeforeUnmount(() => {
		scrollContainer.value?.removeEventListener("touchstart", onTouchStart as EventListener);
		scrollContainer.value?.removeEventListener("touchend", onTouchEnd as EventListener);
	});
</script>

<template>
	<Teleport to="#popovers">
		<Transition>
			<div v-if="pulling || refreshing" ref="indicatorWrapper" class="indicator-container" :style="{ transform: `translateY(${indicatorWrapperTranslateY}px)` }">
				<div class="indicator">
					<Icon v-if="!refreshing" name="refresh" :class="{ ready: pullDistance >= REFRESH_THRESHOLD }" :style="{ rotate: `${indicatorRotate}deg` }" />
					<ProgressRing v-else />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
	.indicator-container {
		@include flex-center;
		position: fixed;
		top: $mobile-toolbar-height;
		right: 0;
		left: 0;
		z-index: $z-sidebar - 1;
		transform: translateY(-48px);
		transition: $fallback-transitions, transform $ease-out-spring 800ms;

		&.v-enter-from,
		&.v-leave-to {
			transform: translateY(-48px) !important;

			// .indicator {
			// 	box-shadow: none;
			// }
		}
	}

	.indicator {
		@include flex-center;
		@include circle;
		@include square(40px);
		@include card-shadow;
		color: c(accent);
		background-color: c(main-bg);

		.icon {
			font-size: 30px;
			opacity: 0.5;
			transition: $fallback-transitions, rotate 0s, opacity $ease-out-expo 500ms;

			&.ready {
				opacity: 1;
			}
		}

		.progress-ring {
			--size: 20px;
			--thickness: 2.7px;
		}
	}
</style>

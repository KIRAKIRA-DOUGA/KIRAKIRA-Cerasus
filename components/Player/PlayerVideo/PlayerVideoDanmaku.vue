<docs>
	# 弹幕容器
	使用 Danmaku 库：https://github.com/weizhenye/Danmaku
</docs>

<script setup lang="ts">
	import Danmaku from "danmaku/dist/esm/danmaku.dom.js";

	const props = withDefaults(defineProps<{
		/** 媒体可以是 `<video>` 或 `<audio>` 元素，如果未提供，会变成实时模式。 */
		media?: MaybeRef<HTMLMediaElement | undefined>;
		/** 预设的弹幕数据数组，在媒体模式中使用。在 emit API 中有说明格式。 */
		comments?: DanmakuComment[];
		/** 支持 DOM 引擎和 canvas 引擎。canvas 引擎比 DOM 更高效，但相对更耗内存。 */
		engine?: "canvas" | "dom";
		/**
		 * 弹幕基准速度，也可以用 speed API 设置。
		 *
		 * 所有弹幕都有一个 `duration` 属性，表示其存活时间。`duration` 由 `舞台宽度 / danmaku.speed` 计算，其中 `danmaku.speed` 是所有弹幕的一个基准速度，因为每条弹幕的实际速度由 `(弹幕宽度 + 舞台宽度) / duration` 计算。默认速度为 `144`。
		 */
		speed?: number;
		/** 是否隐藏弹幕？ */
		hidden?: boolean;
	}>(), {
		media: undefined,
		comments: () => [],
		engine: "dom",
		speed: undefined,
	});

	const emitted = defineModel<DanmakuComment[]>();
	const danmakuContainer = ref<HTMLDivElement>();
	const danmaku = ref<Danmaku>();
	const resizeObserver = ref<ResizeObserver>();

	/**
	 * 初始化弹幕组件。
	 */
	function initDanmaku() {
		const media = toValue(props.media);
		if (!media || !danmakuContainer.value) return;
		danmaku.value?.destroy();
		danmaku.value = new Danmaku({
			container: danmakuContainer.value,
			media,
			comments: props.comments,
			engine: props.engine,
			speed: props.speed,
		});
	}

	watch(() => props.media, initDanmaku);
	watch(() => props.comments, initDanmaku); // 当请求到新的数据时，重载弹幕组件

	onMounted(() => {
		if (!danmakuContainer.value) return;
		initDanmaku();
		resizeObserver.value = new ResizeObserver(() => {
			try {
				danmaku.value?.resize();
			} catch { }
		});
		resizeObserver.value.observe(danmakuContainer.value);
	});

	onBeforeUnmount(() => {
		danmaku.value?.destroy();
		danmakuContainer.value && resizeObserver.value?.observe(danmakuContainer.value);
	});

	watch(() => props.hidden, hidden => {
		if (!danmaku.value) return;
		if (!hidden) danmaku.value.show();
		else danmaku.value.hide();
	}, { immediate: true });

	watch(() => props.speed, speed => {
		if (!danmaku.value || speed === undefined) return;
		danmaku.value.speed = speed;
	});

	/**
	 * ### 清屏
	 * 清除当前舞台上的弹幕。
	 */
	function clear() {
		danmaku.value?.clear();
	}

	/**
	 * 发**射**弹幕（注意不是发**送**弹幕）。
	 * @param comment - 弹幕内容。
	 */
	function emit(comment: DanmakuComment) {
		danmaku.value?.emit(comment);
	}

	watch(emitted, emittedDanmaku => {
		if (emittedDanmaku) {
			emittedDanmaku.forEach(e => {
				emit(e);
			});
			emitted.value = undefined;
		}
	});

	defineExpose({
		clear, emit,
	});
</script>

<template>
	<div ref="danmakuContainer" class="danmaku-container" :hidden></div>
</template>

<style scoped lang="scss">
	.danmaku-container:deep() {
		pointer-events: none;

		* {
			transition: none;
		}

		.dm {
			@include round-small;

			&.user-sent {
				// box-shadow: -1px -1px black, -1px 1px black, 1px -1px black, 1px 1px black;
				backdrop-filter: invert(1);
			}

			&.dm-rainbow {
				background: linear-gradient(to right, #f2509e, #308bcd);
				background-clip: text;
				-webkit-text-stroke: 2px transparent;
			}
		}
	}
</style>

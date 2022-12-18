<docs>
	点击icon然后播放一段动画的组件

	适合收藏、点赞等小功能
</docs>

<script setup lang="ts">
	import { AnimationItem } from "lottie-web";

	const props = withDefaults(defineProps<{
		width?: number;
		height?: number;
		loop?: boolean;
		autoplay?: boolean;
		animationData: object;
		defaultSlot?: boolean;
		callback?: (anim: AnimationItem) => void;
	}>(), {
		width: 100,
		height: 100,
		callback: undefined,
	});

	const emits = defineEmits<{
		(event: "init", anim: AnimationItem): void;
	}>();

	const anim = ref<AnimationItem>();

	// 动画速度
	const animationSpeed = ref(2);
	// 点击交互标识
	const flag = ref(false);
	// 图标高度
	const iconWidth = computed(() => {
		return props.width;
	});
	// 图标宽度
	const iconHeight = computed(() => {
		return props.height;
	});
	// 点击图标交互
	const toggle = () => {
		if (!anim.value) return;
		if (!props.defaultSlot && props.callback)
			props.callback(anim.value);
		else {
			flag.value = !flag.value;
			if (flag.value) anim.value.play();
			else anim.value.stop();
		}
	};
	// 获取anim对象
	const handleAnimation = (animated: AnimationItem) => {
		anim.value = animated;
		onSpeedChange();
		emits("init", animated);
	};
	// 停止动画
	const stop = () => anim.value?.stop();
	// 播放动画
	const play = () => anim.value?.play();
	// 暂停动画
	const pause = () => anim.value?.pause();
	// 控制播放速度
	const onSpeedChange = () => anim.value?.setSpeed(animationSpeed.value);
</script>

<template>
	<div class="clickIcon">
		<div class="icon-box" :style="{ width: `${width}px`, height: `${height}px` }">
			<slot name="svg" :data="{ toggle, flag, iconWidth, iconHeight }"></slot>
			<Lottie
				:class="{ show: flag === true || !defaultSlot }"
				class="like"
				style="display: none;"
				:loop="loop"
				:autoplay="autoplay"
				:animationData="animationData"
				:height="height"
				:width="width"
				@click="toggle"
				@animCreated="handleAnimation"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.icon-box {
		position: relative;
	}

	.show {
		display: inline-block !important;
	}

	.hidden {
		display: none !important;
	}

	.like {
		cursor: pointer;
	}

	.icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>

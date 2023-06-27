<docs>
	点击 icon 然后播放一段动画的组件。

	适合收藏、点赞等小功能。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 循环播放？ */
		loop?: boolean;
		/** 自动播放？ */
		autoplay?: boolean;
		/** 动画数据 JSON。 */
		animationData: object;
		/** 隐藏？ */
		hidden?: boolean;
		/** 播放速度。 */
		speed?: number;
		/** 状态信息。参数依次为：标记、循环、速度。 */
		state?: AnimatedIconState;
	}>(), {
		speed: 1,
		state: () => [],
	});

	const emits = defineEmits<{
		init: [anim?: AnimationItem];
		click: [anim?: AnimationItem];
		press: [anim?: AnimationItem];
		lift: [anim?: AnimationItem];
	}>();

	const anim = ref<AnimationItem>();
	const iconBox = ref<HTMLDivElement>();
	const isPointerDown = ref(false);
	const isPointerEnter = ref(false);

	watch(() => props.speed, () => onSpeedChange());
	watch(() => props.state, () => onStateChange());

	/**
	 * 点击图标交互事件。
	 */
	function onClick() {
		if (!anim.value) return;
		isPointerDown.value = false;
		emits("click", anim.value);
	}
	
	/**
	 * 停止动画。
	 */
	function stop() {
		anim.value?.stop();
	}
	
	/**
	 * 播放动画。
	 */
	function play() {
		anim.value?.play();
	}
	
	/**
	 * 暂停动画。
	 */
	function pause() {
		anim.value?.pause();
	}
	
	/**
	 * 控制播放速度。
	 */
	function onSpeedChange() {
		anim.value?.setSpeed(props.speed);
	}
	
	/**
	 * 控制状态信息。
	 */
	function onStateChange() {
		const ani = anim.value;
		if (!ani) return;
		let marker: string | undefined, loop: boolean | undefined, speed: number | undefined;
		if (props.state instanceof Array)
			[marker, loop, speed] = props.state;
		else
			({ marker, loop, speed } = props.state);
		if (loop !== undefined) ani.loop = loop;
		if (speed) ani.playSpeed = speed; // 在不为 0 时有效。
		if (!marker) {
			if (speed === 0) ani.pause();
			else ani.play();
		} else {
			if (speed === 0) ani.goToAndStop(marker, true);
			else ani.goToAndPlay(marker, true);
		}
	}
	
	/**
	 * 当 Lottie 动画完成加载后调用，用于获取 anim 对象。
	 * @param animated - anim 对象。
	 */
	function onAnimationCreated(animated: AnimationItem) {
		anim.value = animated;
		onSpeedChange();
		onStateChange();
		emits("init", animated);
	}

	useEventListener(iconBox, "animationstart", e => {
		if (!anim.value/*  || isInitInsteadOfLift.value */) return;
		if (e.animationName.startsWith("press")) emits("press", anim.value);
		else if (e.animationName.startsWith("lift")) emits("lift", anim.value);
	});

	/**
	 * 指针按下事件。
	 * @param e - 指针事件。
	 */
	function onPointerDown(e: PointerEvent) {
		const div = e.currentTarget as HTMLDivElement;
		emits("press", anim.value);
		isPointerDown.value = true;
		isPointerEnter.value = true;
		window.addEventListener("pointerup", onPointerUp);
		div.addEventListener("pointerleave", onPointerLeave);
	}

	/**
	 * 指针进入事件。
	 * @param e - 指针事件。
	 */
	function onPointerEnter(e: PointerEvent) {
		if (isPointerDown.value)
			onPointerDown(e);
	}

	/**
	 * 指针松开事件。
	 * @param e - 指针事件。
	 */
	function onPointerUp(e: PointerEvent) {
		isPointerDown.value = false;
		onPointerLeave(e);
		window.removeEventListener("pointerup", onPointerUp);
	}

	/**
	 * 指针离开事件。
	 * @param _e - 指针事件。
	 */
	function onPointerLeave(_e: PointerEvent) {
		if (isPointerEnter.value)
			emits("lift", anim.value);
		isPointerEnter.value = false;
		iconBox.value?.removeEventListener("pointerleave", onPointerLeave);
	}

	defineExpose({
		play, pause, stop,
	});
</script>

<template>
	<Comp>
		<div
			ref="iconBox"
			class="icon-box"
			@click="onClick"
			@pointerdown="onPointerDown"
			@pointerenter="onPointerEnter"
		>
			<Lottie
				:loop="loop"
				:autoplay="autoplay"
				:animationData="animationData"
				:hidden="hidden"
				@animCreated="onAnimationCreated"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp,
	.icon-box,
	.lottie {
		display: inline-block;
		line-height: 0;
	}

	.icon-box {
		position: relative;

		.lottie {
			@include square(1em);
			cursor: pointer;
			
			:deep(*) {
				fill: c(accent);
			}
		}
	}
</style>

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
		/** 动画数据 JSON 或其文件名。 */
		name: object | DeclaredLotties;
		/** 隐藏？ */
		hidden?: boolean;
		/** 播放速度。 */
		speed?: number;
		/** 状态信息。参数依次为：标记、循环、速度。 */
		state?: AnimatedIconState;
		/** 是否保持图标本身的颜色。 */
		filled?: boolean;
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

	const animationData = ref<object>();
	const anim = ref<AnimationItem>();
	const iconBox = ref<HTMLDivElement>();

	watch(() => props.speed, () => onSpeedChange());
	watch(() => props.state, () => onStateChange());

	/**
	 * 获取以文件名形式的图标。
	 */
	function getIcon() {
		if (typeof props.name !== "string") {
			animationData.value = props.name;
			return;
		}
		try {
			const iconsImport = import.meta.glob<string>("assets/lotties/**/**.json", {
				query: "?raw",
				import: "default",
				eager: true,
			});
			const rawIcon = iconsImport[`/assets/lotties/${props.name}.json`];
			animationData.value = JSON.parse(rawIcon);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(`Lottie file '${props.name}' doesn't exist in 'assets/lotties'`, e);
		}
	}

	/**
	 * 点击图标交互事件。
	 */
	function onClick() {
		if (!anim.value) return;
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
		if (speed) { // 在不为 0 时有效。
			ani.playSpeed = Math.abs(speed);
			ani.playDirection = Math.sign(speed);
		}
		if (!marker)
			if (speed === 0) ani.pause();
			else ani.play();
		else {
			const markerItem = ani.markers.find(m => m.payload.name === marker);
			if (markerItem)
				if (Object.is(speed, -0)) ani.goToAndStop(marker, true);
				else if (Object.is(speed, 0)) ani.goToAndStop(markerItem.time + markerItem.duration - 1, true);
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

	usePressed(iconBox, () => emits("press", anim.value), () => emits("lift", anim.value));

	defineExpose({
		play, pause, stop,
	});

	await getIcon();
	watchEffect(getIcon);
</script>

<template>
	<Comp>
		<div
			ref="iconBox"
			class="icon-box"
			@click="onClick"
		>
			<Lottie
				:class="{ filled }"
				:loop
				:autoplay
				:animationData="animationData!"
				:hidden
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

			&:not(.filled) :deep(*) {
				fill: currentColor;
			}
		}
	}
</style>

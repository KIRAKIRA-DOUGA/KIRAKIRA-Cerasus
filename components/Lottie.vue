<script setup lang="ts">
	import lottie from "lottie-web";

	const props = defineProps<{
		loop?: boolean;
		autoplay?: boolean;
		animationData: object;
	}>();

	const emits = defineEmits<{
		animCreated: [anim: AnimationItem];
	}>();

	const anim = ref<AnimationItem>();
	const lavContainer = ref<HTMLDivElement>();

	onMounted(() => {
		if (!lavContainer.value) return;
		anim.value = lottie.loadAnimation({
			container: lavContainer.value,
			renderer: "svg",
			loop: props.loop,
			autoplay: props.autoplay,
			animationData: props.animationData,
		}) as AnimationItem;
		emits("animCreated", anim.value);
	});

	onUnmounted(async () => {
		await delay(1000); // 等待界面过渡动画时间。
		anim.value && anim.value.destroy();
	});
</script>

<template>
	<div ref="lavContainer" class="lav-container lottie"></div>
</template>

<style scoped lang="scss">
	.lav-container {
		&,
		:deep(*) {
			transition: none;
		}
	}
</style>

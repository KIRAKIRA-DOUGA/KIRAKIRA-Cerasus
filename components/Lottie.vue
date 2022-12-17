<template>
	<div ref="lavContainer" class="lav-container" :style="style"></div>
</template>

<script setup lang="ts">
	import lottie, { AnimationItem } from "lottie-web";

	const props = withDefaults(defineProps<{
		loop?: boolean;
		autoplay?: boolean;
		animationData: object;
		height?: number;
		width?: number;
	}>(), {
		loop: false,
		autoplay: false,
		height: 100,
		width: 100,
	});

	const style = computed(() => ({
		width: props.width ? `${props.width}px` : "100%",
		height: props.height ? `${props.height}px` : "100%",
	}));

	const emits = defineEmits<{
		(event: "animCreated", anim: AnimationItem): void;
	}>();

	const anim = ref<AnimationItem>();
	const lavContainer = ref<HTMLDivElement>();

	onMounted(() => {
		anim.value = lottie.loadAnimation({
			container: lavContainer.value!,
			renderer: "svg",
			loop: props.loop,
			autoplay: props.autoplay,
			animationData: props.animationData,
		});
		emits("animCreated", anim.value);
	});

	onUnmounted(() => {
		anim.value && anim.value.destroy();
	});
</script>

<style scoped lang="scss">
	.lav-container,
	.lav-container :deep(*) {
		transition: none;
	}
</style>

<script setup lang="ts">
	import visibility from "assets/lotties/visibility.json";
</script>

<template>
	<div class="container">
		<AnimatedIcon :animationData="visibility" autoplay loop />
	</div>
</template>

<style scoped lang="scss">
	.animated-icon {
		:deep(*) {
			fill: c(accent);
		}
	}
</style>

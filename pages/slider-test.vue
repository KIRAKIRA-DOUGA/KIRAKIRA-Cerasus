<docs>
	用于测试Slider精准问题，修复后移除。
</docs>

<script setup lang="ts">
	const value = ref(0);
</script>

<template>
	<div class="slider-test">
		<p>{{ value }}</p>
		<div class="slider-wrapper">
			<Slider v-model="value" :min="0" :max="1" tooltip />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.slider-test {
		@include flex-center;
		flex-direction: column;
		align-items: Flex-Start;
		height: 100dvh;
		margin: 0 10px;
	}

	.slider-wrapper {
		width: 100%;
		margin: 50px 0;
	}
</style>

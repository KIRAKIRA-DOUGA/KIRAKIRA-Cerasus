<docs>
	【【【！！！！！！！！！！用于测试 Slider 精准度问题。修复后移到组件测试页，不要移除！！！！！！！！！！】】】
</docs>

<script setup lang="ts">
	const value = ref(0);
	const pending = ref<"current" | "cursor">(false as never);
</script>

<template>
	<div class="slider-test">
		<Segmented v-model="pending">
			<SegmentedItem :id="(false as never)">不显示</SegmentedItem>
			<SegmentedItem id="current">滑块值</SegmentedItem>
			<SegmentedItem id="cursor">光标值</SegmentedItem>
		</Segmented>
		<p>{{ value }}</p>
		<div class="slider-wrapper">
			<Slider v-model="value" :min="0" :max="1" :pending="pending" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.slider-test {
		@include flex-center;
		flex-direction: column;
		align-items: center;
		height: 100dvh;
		margin: 0 10px;
	}

	p {
		width: 100%;
		margin-top: 40px;
		text-align: center;
	}

	.slider-wrapper {
		width: 100%;
		margin: 50px 0;
	}
</style>

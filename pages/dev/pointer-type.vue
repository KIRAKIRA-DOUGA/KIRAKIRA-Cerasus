<docs>
	# 指针事件类型检测。
	临时测试 Apple Pencil、数位板等特殊设备用。
</docs>

<script setup lang="ts">
	useHead({ title: "指针事件类型检测" });
	const pointerType = ref("");

	/**
	 * 点击事件。
	 * @param e - 指针点击事件。
	 */
	function onPointerUp(e: PointerEvent) {
		pointerType.value = e.pointerType;
	}
</script>

<template>
	<div>
		<h1>指针事件类型检测</h1>
		<span>点击以下按钮可以检测是由何种输入设备点击的</span>
		<Button @pointerup="onPointerUp">点我</Button>
		<p>{{ pointerType }}</p>
	</div>
</template>

<style scoped lang="scss">
	div {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 24px;
	}

	p {
		font-size: 16px;
	}
</style>

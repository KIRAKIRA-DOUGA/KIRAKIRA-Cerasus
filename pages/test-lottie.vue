<script setup lang="ts">
	import visibility from "assets/lotties/visibility.json";

	const visible = ref(false);
	const visibleText = computed(() => visible.value ? "visible" : "invisible");
	const state = ref<AnimatedIconState>([visibleText.value, false, 0]);
	// ['visible pressed', 'visible unpressed', 'invisible', 'invisible pressed', 'invisible unpressed', 'visible']
	const onClick = () => {
		visible.value = !visible.value;
		state.value = [visibleText.value];
	};

	useHead({ title: "动态图标测试页" });
</script>

<template>
	<div class="container">
		<AnimatedIcon
			:animationData="visibility"
			:state="state"
			@press="state = [`${visibleText} pressed`]"
			@lift="state = [`${visibleText} unpressed`]"
			@click="onClick"
		/>
	</div>
</template>

<style scoped lang="scss">
	.animated-icon {
		font-size: 300px;
	}
</style>

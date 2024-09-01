<script setup lang="ts">
	const visible = ref(false);
	const visibleText = computed(() => visible.value ? "visible" : "invisible");
	const state = ref<AnimatedIconState>([visibleText.value, false, 0]);
	// ['visible pressed', 'visible lifted', 'invisible', 'invisible pressed', 'invisible lifted', 'visible']
	const onClick = () => {
		visible.value = !visible.value;
		state.value = [visibleText.value];
	};

	useHead({ title: "动态图标测试页" });
</script>

<template>
	<div class="container">
		<AnimatedIcon
			name="visibility"
			:state
			@press="state = [`${visibleText} pressed`]"
			@lift="state = [`${visibleText} lifted`]"
			@click="onClick"
		/>
	</div>
</template>

<style scoped lang="scss">
	.animated-icon {
		color: c(accent);
		font-size: 300px;
	}
</style>

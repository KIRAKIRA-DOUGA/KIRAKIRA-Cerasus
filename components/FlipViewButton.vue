<script setup lang="ts">
	const props = defineProps<{
		direction: "left" | "right";
	}>();
</script>

<template>
	<button class="flip-view-button" :class="[direction]">
		<Icon :name="`caret_${direction}`" />
	</button>
</template>

<style scoped lang="scss">
	button.flip-view-button {
		@include round-small;
		@include flex-center;
		width: 24px;
		height: 100%;
		max-height: 60px;
		// backdrop-filter: blur(4px); // TODO: 效果略丑，待调整。

		.icon {
			color: c(icon-color);
			font-size: 32px;
		}

		&:any-hover {
			background-color: c(icon-color, 7%);
		}

		&:active {
			opacity: 0.6;
		}
	}
</style>

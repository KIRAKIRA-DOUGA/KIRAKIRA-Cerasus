<script setup lang="ts">
	defineProps<{
		page: number;
	}>();
</script>

<template>
	<div class="item">
		<div class="background hover"></div>
		<div class="background pressed"></div> <!-- 按下状态统一叫 pressed 不叫 active 是为了与活跃状态区分开。 -->
		<span>{{ page }}</span>
	</div>
</template>

<style scoped lang="scss">
	$size: 36px;

	.item {
		@include flex-center;

		width: $size;
		height: $size;
		color: $light-mode-icon-color;
		flex-shrink: 0;
		cursor: pointer;
		transition: none !important;
		position: relative;

		& > span {
			position: relative;
			z-index: 2;
		}

		.background {
			color: gray;
			position: absolute;
			width: 300%;
			height: 100%;
			flex-shrink: 0;
			opacity: 0;
			pointer-events: none;
			z-index: 0 !important;

			&.hover {
				background: radial-gradient(50% 250% at 50% 50%, $light-mode-gray 33.33%, color.adjust($light-mode-gray, $alpha: -1) 100%);
			}

			&.pressed {
				background: radial-gradient(50% 250% at 50% 50%, $light-mode-gray-2 33.33%, color.adjust($light-mode-gray-2, $alpha: -1) 100%);
			}
		}

		&:hover:not(:active) .background.hover,
		&:active .background.pressed {
			opacity: 1;
		}
	}
</style>

<docs>
	# 单选框菜单选项
	适用于组合框（下拉菜单）、上下文菜单等。
	选项左侧有指示器，但是不会像选项卡、导航视图那样连贯地移动。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 是否呈活跃状态？ */
		active: boolean;
	}>();
</script>

<template>
	<Comp
		v-ripple
		class="item"
		:class="{ active }"
		role="menuitemradio"
		:aria-checked="active"
	>
		<span><slot></slot></span>
	</Comp>
</template>

<style scoped lang="scss">
	.item {
		@include round-small;
		position: relative;
		display: flex;
		align-items: center;
		height: 36px;
		padding: 0 12px;
		color: c(text-color);
		cursor: pointer;

		&:hover {
			background-color: c(hover-overlay);
		}

		&.active {
			background-color: c(hover-overlay);

			&::before {
				@include oval;
				position: absolute;
				left: 0;
				z-index: 3;
				width: 3px;
				height: 16px;
				background-color: c(accent);
				animation: show-indicator 250ms $ease-out-max;
				content: "";
			}

			&:active:hover::before {
				height: 10px;
			}
		}
	}
	
	@keyframes show-indicator {
		from {
			height: 0;
		}
	}
</style>

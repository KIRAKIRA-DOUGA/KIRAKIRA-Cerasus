<docs>
	# 首屏加载画面。
	以后有分 P 切换和在视频页面直接进入其它视频（比如推荐视频）的时候可以考虑做一下类似拉卷帘门的动画（参考 maimai 的闭店动画）。
</docs>

<script setup lang="ts">
	/** 是否显示？ */
	const shown = defineModel<boolean>();
</script>

<template>
	<Transition>
		<Comp v-if="shown">
			<LogoCover noTitle />
			<LogoText />
			<div class="logo-player">
				<Icon class="logo" name="yozora" />
				<p class="name">YOZORA PLAYER</p>
			</div>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	:comp {
		background-color: c(main-bg);
		transition-duration: 500ms;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}
	}

	.logo-cover {
		--width: 100%;
		--height: 100%;
	}

	.logo-text {
		--form: full;
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 2;

		@include mobile {
			display: none;
		}
	}

	.logo-player {
		@include flex-center;
		position: absolute;
		top: 8px;
		left: 12px;
		overflow: clip;
		color: c(accent);
		font-size: 22px;

		.icon {
			font-size: 1.5em;
		}

		p {
			font-family: $english-logo-fonts;
			font-weight: 600;
		}
	}
</style>

<script setup lang="ts">
	const counts = reactive({
		play: 100,
		rating: 5,
		star: 100,
		danmaku: 100,
		watching: 10,
	});

	/**
	 * 收藏视频。
	 */
	function favorite() {
		useEvent("user:requestLogin");
	}

	/**
	 * 分享视频。
	 */
	function share() {
		navigator.share({
			title: document.title,
			text: "绮良动画",
			url: location.href,
		});
	}
</script>

<template>
	<kira-component class="player-video-panel">
		<div class="top">
			<div class="info">
				<div class="count-play">
					<NuxtIcon name="play" />
					<span>播放 {{ counts.play }}</span>
				</div>
				<div class="count-rating">
					<NuxtIcon :name="counts.rating >= 0 ? 'thumb_up' : 'thumb_down'" />
					<span>评分 {{ counts.rating }}</span><!-- FIXME: [兰音] 应该看得出来数值变化时的抖动。 -->
				</div>
				<div class="count-star">
					<NuxtIcon name="star" />
					<span>收藏 {{ counts.star }}</span>
				</div>
				<div class="count-danmaku">
					<NuxtIcon name="play" />
					<span>弹幕 {{ counts.danmaku }}</span>
				</div>
				<div class="watching">
					<span class="watching-number">10</span>
					<span class="watching-description">人正在看</span>
				</div>
			</div>
			<div class="buttons">
				<PlayerVideoPanelButton icon="thumb_up" class="button-like" @click="counts.rating++" />
				<PlayerVideoPanelButton icon="thumb_down" class="button-dislike" @click="counts.rating--" />
				<PlayerVideoPanelButton icon="star" class="button-star" @click="favorite" />
				<PlayerVideoPanelButton icon="share" class="button-share" @click="share" />
				<PlayerVideoPanelButton icon="history" class="button-history" />
				<PlayerVideoPanelButton icon="settings" class="button-settings" />
			</div>
		</div>
		<PlayerVideoPanelDanmakuList />
		<PlayerVideoPanelDanmakuSend />
	</kira-component>
</template>

<style scoped lang="scss">
	$panel-width: 350px;
	$info-height: 80px;
	$buttons-height: 48px;

	.player-video-panel {
		@include flex-block;
		flex-shrink: 0;
		width: $panel-width;
		height: inherit;
		overflow: hidden;

		@media #{$tablet} {
			display: none;
		}
	}

	.top {
		@include card-in-card-shadow;
	}

	.info {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 1fr);
		width: 100%;
		height: $info-height;
		color: c(icon-color);

		> * {
			@include flex-center;
			gap: 4px;

			.nuxt-icon {
				font-size: 20px;
			}
		}

		> .watching {
			flex-direction: column;
			grid-row: 1 / -1;

			.watching-number {
				font-weight: 500;
				font-size: 24px;
			}
		}
	}

	.buttons {
		@include flex-center;
		justify-content: space-evenly;
		height: $buttons-height;
		overflow: hidden;
	}
</style>

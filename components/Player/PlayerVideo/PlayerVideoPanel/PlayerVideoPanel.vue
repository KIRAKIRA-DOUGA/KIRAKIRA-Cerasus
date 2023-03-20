<script setup lang="ts">
	const onClickStar = () => useEvent("user:requestLogin");
</script>

<template>
	<kira-component class="player-video-panel">
		<div class="top">
			<div class="info">
				<div class="counts">
					<div>
						<div class="count-play">
							<NuxtIcon name="play" />
							<span>播放 100</span>
						</div>
						<div class="count-rating">
							<NuxtIcon name="thumb_up" /> <!-- TODO: [艾拉] 如果评分是负数的话这里变成一个踩的icon。 -->
							<span>评分 100</span>
						</div>
					</div>
					<div>
						<div class="count-star">
							<NuxtIcon name="star" />
							<span>收藏 100</span>
						</div>
						<div class="count-danmaku">
							<NuxtIcon name="play" />
							<span>弹幕 100</span>
						</div>
					</div>
					<div class="watching">
						<span class="watching-number">10</span>
						<span class="watching-description">人正在看</span>
					</div>
				</div>

			</div>
			<div class="buttons">
				<PlayerVideoPanelButton icon="thumb_up" class="button-like" @click="onClickStar" />
				<PlayerVideoPanelButton icon="thumb_down" class="button-dislike" @click="onClickStar" />
				<PlayerVideoPanelButton icon="star" class="button-star" @click="onClickStar" />
				<PlayerVideoPanelButton icon="share" class="button-share" />
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
		display: flex;
		height: $info-height;
		color: c(icon-color);

		.counts {
			@include flex-block;
			flex-direction: row;
			flex-grow: 1;
			justify-content: space-between;

			> div {
				@include flex-block;
				width: 100%;
				height: 100%;
			}

			> * > div {
				@include flex-center;
				flex-grow: 1;
				gap: 4px;
				height: 100%;

				.nuxt-icon {
					font-size: 20px;
				}
			}
		}

		.watching {
			@include flex-center;
			flex-direction: column;
			height: inherit;

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

		> * {
			font-size: 24px;
		}
	}
</style>

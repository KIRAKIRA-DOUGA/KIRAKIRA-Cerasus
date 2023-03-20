<script setup lang="ts">
	const onClickStar = () => useEvent("user:requestLogin");
</script>

<template>
	<kira-component class="player-video-panel">
		<div class="top">
			<div class="info">
				<div class="basic-info">

				</div>
				<div class="watching">
					<span class="watching-number">10</span>
					<span class="watching-description">人正在看</span>
				</div>
			</div>
			<div class="buttons">
				<PlayerVideoPanelButton icon="thumb_up" class="button-like" />
				<PlayerVideoPanelButton icon="thumb_down" class="button-dislike" />
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
	$panel-width: 392px;
	$info-height: 80px;
	$buttons-height: 48px;
	$watching-width: 128px;

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
		width: inherit;
	}

	.info {
		display: flex;
		height: $info-height;
		color: c(icon-color);

		.watching {
			@include flex-center;
			flex-direction: column;
			width: $watching-width;
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

		> .button-star {
			font-size: 28px;
		}
	}
</style>

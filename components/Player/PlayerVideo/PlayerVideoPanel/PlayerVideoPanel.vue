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
			<div class="controls">
				<PlayerButton icon="star" @click="onClickStar" />
			</div>
		</div>
		<PlayerVideoPanelDanmakuList />
		<PlayerVideoPanelDanmakuSend />
	</kira-component>
</template>

<style scoped lang="scss">
	$panel-width: 392px;
	$info-height: 80px;
	$controls-height: 48px;

	.player-video-panel {
		@include flex-block;
		flex-shrink: 0;
		width: $panel-width;
		height: inherit;
		overflow: hidden;
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
			height: inherit;

			.watching-number {
				font-weight: 500;
				font-size: 24px;
			}
		}
	}

	.controls {
		height: $controls-height;
	}
</style>

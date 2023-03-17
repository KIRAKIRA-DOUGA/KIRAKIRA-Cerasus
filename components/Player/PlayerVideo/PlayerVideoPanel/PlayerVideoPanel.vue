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
	.player-video-panel {
		@include flex-block;
		width: 392px;
		min-width: 392px;
		max-width: 392px;
		height: inherit;
		overflow: hidden;
	}

	.top {
		@include card-in-card-shadow;
		width: inherit;
	}

	.info {
		display: flex;
		height: 80px;
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
		height: 48px;
	}
</style>

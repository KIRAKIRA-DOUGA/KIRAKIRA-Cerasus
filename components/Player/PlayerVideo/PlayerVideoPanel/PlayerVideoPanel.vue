<script setup lang="ts">

</script>

<template>
	<kira-component class="player-video-panel">
		<div class="player-video-panel-top">
			<div class="player-video-info">
				<div class="basic-info">

				</div>
				<div class="watching">
					<span class="watching-number">10</span>
					<span class="watching-description">人正在看</span>
				</div>
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

	.player-video-panel-top {
		@include card-in-card-shadow;
		width: inherit;
		height: 128px;
	}

	.player-video-info {
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
</style>

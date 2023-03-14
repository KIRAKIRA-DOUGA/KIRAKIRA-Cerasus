<script setup lang="ts">
</script>

<template>
	<kira-component class="player-video-danmaku-list">
		<header class="danmaku-list-header">
			<span>时间</span>
			<span>内容</span>
			<span>发送时间</span>
		</header>
	</kira-component>
</template>

<style scoped lang="scss">
	.player-video-danmaku-list {
		@include flex-block;
		flex-grow: 1;
		width: inherit;
		color: c(icon-color);
	}

	.danmaku-list-header {
		display: flex;
		height: 36px;

		> * {
			@include flex-center;
			flex-direction: row;
			height: inherit;
		}
	}
</style>

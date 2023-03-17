<script setup lang="ts">

</script>

<template>
	<kira-component class="player-video-danmaku-list">
		<header class="danmaku-list-header">
			<textarea readonly>时间</textarea>
			<textarea readonly>内容</textarea>
			<textarea readonly>发送时间</textarea>
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
		$height: 36px;
		display: flex;
		height: $height;

		> * {
			@include flex-center;
			flex-direction: row;
			height: inherit;
			padding: 0 12px;
			overflow: hidden;
			line-height: $height;
			background-color: transparent;
			border: none;
			border-right: 1px solid transparent;
			resize: horizontal;

			&:hover {
				border-right-color: c(gray-2);
			}

			&:active {
				border-right-color: c(accent-pressed);
			}
		}
	}
</style>

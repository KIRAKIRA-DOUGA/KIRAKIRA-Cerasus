<script setup lang="ts">

</script>

<template>
	<kira-component class="player-video-danmaku-list">
		<table class="lite">
			<thead>
				<th>时间</th>
				<th>内容</th>
				<th>发送时间</th>
			</thead>
			<tbody>
				<tr v-for="i in 100" :key="i">
					<td>{{ new Duration(i - 1) }}</td>
					<td>第{{ digitCase(i) }}，火前留名！</td>
					<td>{{ formatDate(new Date(), "yyyy-MM-dd") }}</td>
				</tr>
			</tbody>
		</table>
	</kira-component>
</template>

<style scoped lang="scss">
	.player-video-danmaku-list {
		@include flex-block;
		flex-grow: 1;
		color: c(icon-color);

		table {
			@include flex-block;
			height: 100%;
			contain: strict;

			tbody {
				overflow: auto;
			}
		}
	}

	.header {
		$height: 36px;
		display: flex;
		height: $height;

		> * {
			@include flex-center;
			flex-direction: row;
			flex-shrink: 0;
			height: inherit;
			padding: 0 12px;
			overflow: hidden;
			line-height: $height;
			background-color: transparent;
			border: none;
			border-right: 1px solid transparent;
			transition: none;
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

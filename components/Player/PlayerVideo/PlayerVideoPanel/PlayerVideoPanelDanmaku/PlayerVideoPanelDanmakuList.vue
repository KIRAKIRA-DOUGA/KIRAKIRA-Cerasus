<script setup lang="ts">
	const danmakuItemMenu = ref<InstanceType<typeof Menu>>();
	const currentDanmakuIndex = ref(0);
	const { copy } = useClipboard();

	/**
	 * 获取弹幕。
	 * @param index - 弹幕序号。
	 * @returns - 弹幕信息。
	 */
	function getDanmaku(index: number) {
		return {
			videoTime: new Duration(index - 1),
			content: `第${digitCase(index)}，火前留名！`,
			sendTime: formatDate(new Date(), "yyyy-MM-dd"),
		};
	}
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
				<tr v-for="i in 100" :key="i" @contextmenu.prevent="e => { currentDanmakuIndex = i; danmakuItemMenu?.show(e); }">
					<td v-for="(value, key) in getDanmaku(i)" :key="key">{{ value }}</td>
				</tr>
			</tbody>
		</table>
		<Menu ref="danmakuItemMenu">
			<MenuItem icon="copy" @click="() => { copy(getDanmaku(currentDanmakuIndex).content); useToast('已复制'); }">复制</MenuItem>
			<MenuItem>举报</MenuItem>
		</Menu>
	</kira-component>
</template>

<style scoped lang="scss">
	.player-video-danmaku-list {
		@include flex-block;
		flex-grow: 1;
		color: c(icon-color);

		table {
			@include flex-block;
			@include square(100%);
			contain: strict;
			border-spacing: 0;

			tbody {
				overflow: auto;
			}

			th,
			td {
				padding: 0.25rem 0.75rem;
			}

			tr {
				width: 100%; // TODO: 现在好了，改了 `contain: strict;` 之后，不能占据全宽度了。
			}

			tr:hover {
				background-color: c(gray-40);
			}
		}
	}

	/* .header { // DELETE: 即将删除。
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
	} */
</style>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 投稿日期？修改日期？ */ // TODO: 投稿日期？修改日期？两个日期我觉得应该都要显示。
		date: Date;
		/** 分区。 */
		category: string;
		/** 版权。 */
		copyright: Copyright;
		/** 标题。 */
		title: string;
		/** 视频 ID。 */
		videoId: number;
		/** 标签们。 */
		tags?: string[];
		/** 封面地址 */
		cover?: string;
	}>(), {
		tags: () => [], // （？）奇怪的写法
		cover: undefined,
	});

	const flyoutTag = ref<FlyoutModel>();

	/**
	 * 下载封面。
	 */
	function downloadCover() {
		if (props.cover) {
			const image = useImage();
			const IMAGE_MAX_WIDTH = 999999, KIRAKIRA_IMAGE_PROVIDER = "kirakira";
			window.open(image(props.cover, { width: IMAGE_MAX_WIDTH }, { provider: KIRAKIRA_IMAGE_PROVIDER }), "_blank"); // TODO: 先暂时改为在新标签页中直接打开图片的样式，而非下载图片
			// downloadFile(props.cover, `${props.title} (kv${props.videoId})`);
		} else useToast("无法查看封面!", "error"); // TODO 使用多语言
	}
</script>

<template>
	<Comp role="contentinfo">
		<div class="info">
			<div class="data">
				<CreationDetailItem icon="calendar"><DateTime :dateTime="date" showTime /></CreationDetailItem>
				<CreationDetailItem icon="category">{{ category }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'original'" icon="fact_check">{{ t.original }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'authorized-repost'" icon="local_shipping">{{ t.authorized_repost }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'repost'" icon="local_shipping">{{ t.repost }}</CreationDetailItem>
				<CreationDetailItem icon="photo" clickable @click="downloadCover">{{ t.view_cover }}</CreationDetailItem>
				<CreationDetailItem icon="playlist_play" clickable>{{ t.watch_later }}</CreationDetailItem>
				<CreationDetailItem icon="arrow_down" clickable>{{ t.download_video }}</CreationDetailItem>
				<CreationDetailItem icon="flag" clickable>{{ t.report_creation }}</CreationDetailItem>
			</div>
			<h1>{{ title }}</h1>
		</div>
		<div class="tags">
			<Tag
				v-for="tag in tags"
				:key="tag"
				link="/search"
				:query="{ q: tag }"
			>{{ tag }}</Tag>
			<Tag class="add-tag" @click="e => flyoutTag = [e, 'y']"><Icon name="add" /></Tag>
		</div>
		<FlyoutTag v-model="flyoutTag" />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.data {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}

	h1 {
		font-weight: bold;
		font-size: 24px;
		user-select: text;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.add-tag {
			padding: 6px;
			color: c(icon-color);
			font-size: 18px;
			aspect-ratio: 1 / 1;
		}
	}
</style>

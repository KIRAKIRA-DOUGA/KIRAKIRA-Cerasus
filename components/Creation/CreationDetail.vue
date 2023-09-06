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
		/** 标签们。 */
		tags?: string[];
	}>(), {
		tags: () => [], // （？）奇怪的写法
	});

	const flyoutTag = ref<FlyoutModel>();
</script>

<template>
	<Comp role="contentinfo">
		<div class="info">
			<div class="data">
				<CreationDetailItem icon="calendar">{{ formatDate(date, "yyyy/MM/dd hh:mm:ss") }}</CreationDetailItem>
				<CreationDetailItem icon="category">{{ category }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'original'" icon="fact_check">{{ t.original }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'authorized-repost'" icon="local_shipping">{{ t.authorized_repost }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'repost'" icon="local_shipping">{{ t.repost }}</CreationDetailItem>
				<a><CreationDetailItem icon="photo">{{ t.view_cover }}</CreationDetailItem></a>
				<a><CreationDetailItem icon="playlist_play">{{ t.watch_later }}</CreationDetailItem></a>
				<a><CreationDetailItem icon="arrow_down">{{ t.download_video }}</CreationDetailItem></a>
				<a><CreationDetailItem icon="flag">{{ t.report_creation }}</CreationDetailItem></a>
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
		}
	}
</style>

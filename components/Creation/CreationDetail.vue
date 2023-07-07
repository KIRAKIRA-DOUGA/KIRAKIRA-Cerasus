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
</script>

<template>
	<Comp role="contentinfo">
		<div class="info">
			<div class="data">
				<CreationDetailItem icon="calendar">{{ formatDate(date, "yyyy-MM-dd h:mm:ss") }}</CreationDetailItem>
				<CreationDetailItem icon="category">{{ category }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'original'" icon="fact_check">原创内容</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'authorized-repost'" icon="local_shipping">授权转载</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'repost'" icon="local_shipping">转载</CreationDetailItem>
				<a><CreationDetailItem icon="photo">查看封面</CreationDetailItem></a>
				<a><CreationDetailItem icon="flag">稿件投诉</CreationDetailItem></a>
			</div>
			<h1>{{ title }}</h1>
		</div>
		<div class="tags">
			<Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
		</div>
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
	}
</style>

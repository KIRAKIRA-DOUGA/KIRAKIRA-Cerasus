<script setup lang="ts">
	const props = withDefaults(defineProps<{
		date: Date;
		category: string;
		isOriginal: boolean;
		title: string;
		tags?: string[];
	}>(), {
		tags: () => [], // （？）奇怪的写法
	});
</script>

<template>
	<Comp>
		<div class="info">
			<div class="data">
				<CreationData icon="calendar">{{ formatDate(date, "yyyy-MM-dd h:mm:ss") }}</CreationData>
				<CreationData icon="category">{{ category }}</CreationData>
				<CreationData v-if="isOriginal" icon="fact_check">原创内容</CreationData>
				<CreationData v-else icon="copy">授权转载</CreationData>
				<a><CreationData icon="photo">查看封面</CreationData></a>
				<a><CreationData icon="flag">稿件投诉</CreationData></a>
			</div>
			<h1>{{ title }}</h1>
		</div>
		<div class="tags">
			<Tag>233</Tag>
			<Tag>天下笨蛋是一家</Tag>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-block;
		gap: 16px;
	}

	.info {
		@include flex-block;
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
		gap: 8px;
	}
</style>

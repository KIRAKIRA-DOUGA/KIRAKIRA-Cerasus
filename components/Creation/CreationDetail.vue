<script setup lang="ts">
</script>

<template>
	<Comp>
		<div class="info">
			<div class="data">
				<CreationData icon="calendar">2022-08-30 18:00:00</CreationData>
				<CreationData icon="category">音MAD</CreationData>
				<CreationData icon="fact_check">原创内容</CreationData>
				<CreationData icon="photo">查看封面</CreationData>
				<CreationData icon="flag">稿件投诉</CreationData>
			</div>
			<h1>这里是 233333 的一段长长长长长的标题哇【KIRAKIRA】</h1>
		</div>
		<!-- TODO: [艾拉] 现在这是临时的，需要可编辑的Tag列表组件，在上传稿件的地方也会用到。 -->
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

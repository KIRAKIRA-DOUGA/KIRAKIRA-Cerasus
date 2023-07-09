<script setup lang="ts">
	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);
</script>

<template>
	<div class="container">
		<div class="toolbox-card left">
			<Accordion>
				<AccordionItem title="我的收藏夹" />
				<AccordionItem title="关注收藏夹" />
			</Accordion>
		</div>

		<div class="toolbox-card center">
			<div class="toolbar">
				<div class="left">
					<Button secondary icon="info">修改信息</Button>
					<Button secondary icon="clear_all">清理已失效视频</Button>
					<Button secondary icon="placeholder">关注收藏夹</Button>
					<Button secondary icon="play">播放全部</Button>
				</div>
				<div class="right">
					<Button secondary icon="add">添加视频</Button>
					<Button secondary icon="placeholder">批量选择</Button>
				</div>
			</div>
			<div class="videos-grid">
				<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			</div>
		</div>

		<div class="toolbox-card right">
			<Subheader icon="sort">排序</Subheader>
			<Sort v-model="sort">
				<SortItem id="date" preferOrder="descending">投稿日期</SortItem>
				<SortItem id="play" preferOrder="descending">播放数</SortItem>
				<SortItem id="danmaku" preferOrder="descending">弹幕数</SortItem>
				<SortItem id="comment" preferOrder="descending">评论数</SortItem>
				<SortItem id="star" preferOrder="descending">收藏数</SortItem>
				<SortItem id="duration">视频时长</SortItem>
			</Sort>
			<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.toolbar {
		@include card-in-card-shadow;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px;

		> div {
			display: flex;
			flex-wrap: wrap;
		}

		> .right {
			justify-content: flex-end;
		}
	}

	.container > .left {
		padding: 0;
	}

	.container > .center {
		padding: 0;
	}
</style>

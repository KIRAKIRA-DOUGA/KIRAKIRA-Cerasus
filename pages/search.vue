<script setup lang="ts">
	useHead({ title: "搜索" });

	const view = ref<ViewType>("grid");
	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "ascending"]);
</script>

<template>
	<div class="container">
		<ShadingIcon icon="search" position="right top" />
		<HeadingGroup name="搜索" englishName="Search" />
		<div class="toolbox-card">
			<ToolboxView v-model="view" />
			<Sort v-model="sort" :style="{ gridTemplateColumns: '1fr 1fr' }">
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

<script setup lang="ts">
	useHead({ title: t.search });

	const view = ref<ViewType>("grid");
	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);
	const search = ref("");
</script>

<template>
	<div class="container">
		<ShadingIcon icon="search" position="right top" />
		<HeadingGroup :name="t.search" englishName="Search" />

		<div class="card-container">

			<div class="center">
				<div class="videos-grid"></div>
			</div>

			<div class="right">

				<div class="toolbox-card">
					<TextBox v-model="search" :placeholder="t.search" icon="search" />
				</div>

				<div class="toolbox-card">
					<section>
						<ToolboxView v-model="view" />
					</section>

					<section>
						<Subheader icon="sort">{{ t.sort_by }}</Subheader>
						<Sort v-model="sort">
							<SortItem id="date" preferOrder="descending">{{ t.upload_date }}</SortItem>
							<SortItem id="view" preferOrder="descending">{{ t.sort_playback }}</SortItem>
							<SortItem id="danmaku" preferOrder="descending">{{ t.sort_danmaku }}</SortItem>
							<SortItem id="comment" preferOrder="descending">{{ t.sort_comment }}</SortItem>
							<SortItem id="favorite" preferOrder="descending">{{ t.sort_favorite }}</SortItem>
							<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem>
							<SortItem id="rating">{{ t.rating }}</SortItem>
						</Sort>
					</section>
					<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
				</div>

			</div>

		</div>

	</div>
</template>

<style scoped lang="scss">
	.card-container {
		display: flex;
		gap: 1rem;
	}

	.center {
		width: 100%;
	}

	.sort {
		grid-template-columns: repeat(2, 1fr);
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>

<script setup lang="ts">
	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(6);
	const sort = ref<SortModel>(["date", "descending"]);
	const toolbar = ref<HTMLDivElement[]>();
	const hideToolbarCaptions = ref(false);
	const isSelectedMode = ref(false);

	useEventListener("window", "resize", onResize);

	onMounted(() => {
		onResize();
	});

	/**
	 * 页面尺寸改变事件。
	 */
	function onResize() {
		if (!toolbar.value) return;
		const toolbarShadow = toolbar.value.findLast(i => i.classList.contains("shadow"));
		if (!toolbarShadow) return;
		let outerWidth = toolbarShadow.offsetWidth;
		const padding = parseFloat(getComputedStyle(toolbarShadow).padding);
		outerWidth -= padding * 2;
		let innerWidth = 0;
		for (const child of toolbarShadow.children)
			innerWidth += child.clientWidth;
		hideToolbarCaptions.value = innerWidth > outerWidth;
	}
</script>

<template>
	<div class="container">
		<div class="toolbox-card left">
			<Accordion>
				<AccordionItem :title="t.favorites.my_favorites">
					<template #actions>
						<SoftButton icon="add" @click.stop />
					</template>
				</AccordionItem>
				<AccordionItem :title="t.favorites.subscribed_favorites">
					<template #actions>
						<SoftButton icon="add" @click.stop />
					</template>
				</AccordionItem>
			</Accordion>
		</div>

		<div class="toolbox-card center">
			<div class="toolbar-wrapper">
				<div
					v-for="i in 2"
					:key="i"
					ref="toolbar"
					class="toolbar"
					:class="{
						shadow: i === 2,
						'hide-captions': hideToolbarCaptions,
					}"
				>
					<div class="left">
						<Button icon="info">{{ t.favorites.modify_info }}</Button>
						<Button icon="clear_all">{{ t.favorites.clear_expired }}</Button>
						<Button icon="star">{{ t.favorites.subscribe }}</Button>
						<Button icon="play">{{ t.favorites.play_all }}</Button>
					</div>
					<div class="right">
						<Button icon="add">{{ t.favorites.add }}</Button>
						<Button
							:class="{ active: isSelectedMode }"
							icon="library_add_check"
							@click="isSelectedMode = !isSelectedMode"
						>{{ t.favorites.multi_select }}</Button>
					</div>
				</div>
			</div>
			<main>
				<ThumbGrid>
					<ThumbVideo
						v-for="i in 5"
						:key="i"
						link="video"
						uploader="艾了个拉"
						:date="new Date()"
						:watchedCount="233_0000"
						:duration="new Duration(2, 33)"
					>{{ "测试视频".repeat(10) }}</ThumbVideo>
				</ThumbGrid>
			</main>
		</div>

		<div class="toolbox-card right">
			<section>
				<Subheader icon="sort">{{ t.sort.by }}</Subheader>
				<Sort v-model="sort">
					<SortItem id="date" preferOrder="descending">{{ t.upload_date }}</SortItem>
					<SortItem id="view" preferOrder="descending">{{ t.sort.view }}</SortItem>
					<SortItem id="danmaku" preferOrder="descending">{{ t.sort.danmaku }}</SortItem>
					<SortItem id="comment" preferOrder="descending">{{ t.sort.comment }}</SortItem>
					<SortItem id="favorite" preferOrder="descending">{{ t.sort.favorite }}</SortItem>
					<SortItem id="duration" preferOrder="descending">{{ t.duration }}</SortItem>
					<SortItem id="rating">{{ t.rating }}</SortItem>
				</Sort>
			</section>
			<Pagination v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.toolbar-wrapper {
		position: relative;
		width: 100%;
	}

	.toolbar {
		@include card-in-card-shadow;
		position: absolute;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px;

		&:first-child {
			position: static;
		}

		> * {
			display: flex;
			flex-shrink: 0;
		}

		.right {
			justify-content: flex-end;
		}

		button {
			--appearance: tertiary;

			&.active {
				--appearance: secondary;
			}
		}

		&.shadow {
			visibility: hidden;
		}

		&.hide-captions:not(.shadow) button {
			--hide-caption: true;
		}
	}

	.toolbox-card {
		&:not(.right) {
			gap: 0;
			padding: 0;
		}

		&.left {
			overflow: visible;
		}
	}

	.accordion-item .soft-button {
		margin: -10px;
	}
</style>

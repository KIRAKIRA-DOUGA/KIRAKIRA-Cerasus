<docs>

</docs>

<script setup lang="ts">
	const props = defineProps<{
		videoId: number;
		title: string;
		image?: string;
		date?: Date; // 上传日期
		category?: string;
		viewCount?: number;
		upvoteCount?: number;
		downvoteCount?: number;
		commentCount?: number;
		danmakuCount?: number;
		collectCount?: number;
		uploader?: string;
		uploaderId?: number;
		duration?: Duration;
	}>();

	const flyoutDeleteConfirm = ref<FlyoutModel>();

	function deleteVideo() {
		flyoutDeleteConfirm.value = undefined;
	}

	const [DefineCountItem, CountItem] = createReusableTemplate<{
		value: number | string;
		icon: DeclaredIcons;
	}>();
</script>

<template>
	<Comp>
		<DefineCountItem v-slot="{ value, icon }">
			<div class="count-item">
				<Icon :name="icon" />
				<span>{{ value }}</span>
			</div>
		</DefineCountItem>
		<div class="info">
			<LocaleLink :to="`/video/kv${videoId}`" class="cover-wrapper">
				<NuxtImg
					v-if="image"
					:provider="environment.cloudflareImageProvider"
					:src="image"
					alt="cover"
					class="cover"
					:draggable="false"
					format="avif"
					width="320"
					height="180"
					:placeholder="[50, 50, 100, 5]"
				/>
				<div v-else class="cover placeholder">
					<Icon name="movie" />
				</div>
			</LocaleLink>
			<div class="text-wrapper">
				<div>
					<LocaleLink :to="`/video/kv${videoId}`" class="title lite">{{ title }}</LocaleLink>
					<p class="date">2333/33/33 33:33:33</p>
				</div>
				<p class="counts">
					<CountItem v-if="viewCount" icon="play" :value="viewCount" />
					<CountItem v-if="upvoteCount" icon="thumb_up" :value="upvoteCount" />
					<CountItem v-if="downvoteCount" icon="thumb_down" :value="downvoteCount" />
					<CountItem v-if="commentCount" icon="chat_bubble" :value="commentCount" />
					<CountItem v-if="danmakuCount" icon="danmaku" :value="danmakuCount" />
					<CountItem v-if="collectCount" icon="star" :value="collectCount" />
				</p>
			</div>
		</div>
		<div class="actions">
			<SoftButton icon="edit" :href="`/contents-management/edit/video/kv${videoId}`" />
			<SoftButton icon="delete" @click="e => flyoutDeleteConfirm = [e, 'y']" />
			<FlyoutConfirm v-model="flyoutDeleteConfirm" :title="$t('confirm.delete_video.title')" icon="delete">
				{{ $t('confirm.delete_video.content', [title]) }}
				<template #footer>
					<Button @click="deleteVideo" severity="danger">{{ $t('delete') }}</Button>
				</template>
			</FlyoutConfirm>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		@include chip-shadow;

		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;

		@include mobile {
			flex-direction: column;
			gap: 4px;
			align-items: stretch;
			padding-bottom: 4px;
		}
	}

	.info {
		display: flex;
		flex-grow: 1;
	}

	.cover-wrapper {
		@include round-large;
		flex-shrink: 0;
		width: 160px;
		height: 90px;
		aspect-ratio: 16 / 9;
		margin-right: 16px;
		overflow: clip;

		@include mobile {
			width: 80px;
			height: 45px;
		}

		.cover {
			&,
			:deep(img) {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.icon {
				@include square(50%);
				color: c(text-color, 20%);

				&:deep(svg) {
					@include square(100%);
				}
			}
		}

		.placeholder {
			@include flex-center;
			background-color: c(text-color, 10%);
		}
	}

	.text-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		color: c(icon-color);

		.title {
			color: c(text-color);
			font-weight: 500;
		}

		.date {
			font-size: 12px;
		}

		.counts {
			display: flex;
			gap: 16px;
		}
	}

	.actions {
		display: flex;
		flex-shrink: 0;

		.soft-button {
			--wrapper-size: 48px;
			--ripple-size: var(--wrapper-size);
		}
	}

	.count-item {
		@include flex-center;
		gap: 2px;
		font-size: 12px;

		.icon {
			font-size: 16px;
		}
	}
</style>

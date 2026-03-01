<script setup lang="ts">
	import NumberFlow from "@number-flow/vue";

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
		tags?: DisplayVideoTag[];
		/** 封面地址 */
		cover?: string;
	}>(), {
		tags: () => [], // （？）奇怪的写法
		cover: undefined,
	});

	const { t } = useI18n();

	const selfUserInfoStore = useSelfUserInfoStore();
	const flyoutTag = ref<FlyoutModel>();
	const menuMoreAction = ref<FlyoutModel>();

	const count = reactive({
		play: 0,
		like: 0,
		dislike: 0,
		save: 0,
	});

	const interactionState = reactive({
		like: false,
		dislike: false,
		save: false,
		watchLater: false,
	});

	/**
	 * 喜欢。
	 */
	function like() {
		if (interactionState.like) {
			count.like--;
			interactionState.like = false;
		} else {
			count.like++;
			interactionState.like = true;
		}
	}

	/**
	 * 不喜欢。
	 */
	function dislike() {
		if (interactionState.dislike) {
			count.dislike--;
			interactionState.dislike = false;
		} else {
			count.dislike++;
			interactionState.dislike = true;
		}
	}

	/**
	 * 收藏。
	 */
	function saveToCollection() {
		if (selfUserInfoStore.isLogined)
			useToast(t("under_construction.feature"), "warning", 5000); // DELETE 请在收藏功能完成后删除该提示
		else
			useEvent("app:requestLogin");
	}

	/**
	 * 收藏。
	 */
	function watchLater() {
		if (selfUserInfoStore.isLogined)
			useToast(t("under_construction.feature"), "warning", 5000); // DELETE 请在收藏功能完成后删除该提示
		else
			useEvent("app:requestLogin");
	}

	/**
	 * 分享。
	 */
	function share() {
		navigator.share({
			title: document.title,
			text: "KIRAKIRA☆DOUGA", // XXX: 这里得放页面的 title。
			url: location.href,
		});
	}

	/**
	 * 下载封面。
	 */
	function downloadCover() {
		if (props.cover) {
			const image = useImage();
			const IMAGE_MAX_WIDTH = 999999;
			window.open(image(props.cover, { width: IMAGE_MAX_WIDTH }, { provider: environment.cloudflareImageProvider }), "_blank"); // TODO: 先暂时改为在新标签页中直接打开图片的样式，而非下载图片
			// downloadFile(props.cover, `${props.title} (kv${props.videoId})`);
		} else useToast(t("toast.something_went_wrong"), "error");
	}

	/**
	 * 举报。
	 */
	function report() {
		if (selfUserInfoStore.isLogined)
			useToast(t("under_construction.feature"), "warning", 5000); // DELETE 请在举报功能完成后删除该提示
		else
			useEvent("app:requestLogin");
	}
</script>

<template>
	<Comp role="contentinfo">
		<div class="info">
			<h1>{{ title }}</h1>
			<div class="data">
				<CreationDetailItem icon="play"><NumberFlow :value="count.play" /></CreationDetailItem>
				<CreationDetailItem icon="calendar"><DateTime :dateTime="date" showTime /></CreationDetailItem>
				<CreationDetailItem icon="category">{{ $t(`category.${category}`) }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'original'" icon="fact_check">{{ $t("original") }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'authorized-repost'" icon="local_shipping">{{ $t("authorized_repost") }}</CreationDetailItem>
				<CreationDetailItem v-if="copyright === 'repost'" icon="local_shipping">{{ $t("repost") }}</CreationDetailItem>
			</div>
		</div>
		<div class="actions">
			<div class="main">
				<div>
					<SoftButton v-tooltip:bottom="$t('like')" icon="thumb_up" @click="like" :active="interactionState.like" />
					<NumberFlow :value="count.like" />
				</div>
				<div>
					<SoftButton v-tooltip:bottom="$t('dislike')" icon="thumb_down" @click="dislike" :active="interactionState.dislike" />
					<NumberFlow :value="count.dislike" />
				</div>
				<div>
					<SoftButton v-tooltip:bottom="$t('collection.verb')" icon="star" @click="saveToCollection" :active="interactionState.save" />
					<NumberFlow :value="count.save" />
				</div>
			</div>
			<div class="extra">
				<div>
					<SoftButton v-tooltip:bottom="$t('watch_later')" icon="watch_later" @click="watchLater" :active="interactionState.watchLater" />
					<span class="pe">{{ $t("watch_later") }}</span>
				</div>
				<div>
					<SoftButton v-tooltip:bottom="$t('more')" icon="more_vert" class="pe" @click="e => menuMoreAction = [e, 'bottom']" />
					<span class="pe">{{ $t("more") }}</span>
				</div>

				<SoftButton v-tooltip:bottom="$t('share')" icon="share" class="pc" @click="share" />
				<SoftButton v-tooltip:bottom="$t('view_cover')" icon="photo" class="pc" @click="downloadCover" />
				<SoftButton v-tooltip:bottom="$t('download')" icon="download" class="pc" />
				<SoftButton v-tooltip:bottom="$t('report')" icon="flag" class="pc" @click="report" />

				<Menu v-model="menuMoreAction">
					<MenuItem icon="share">{{ $t("share") }}</MenuItem>
					<MenuItem icon="photo">{{ $t("view_cover") }}</MenuItem>
					<MenuItem icon="download">{{ $t("download") }}</MenuItem>
					<MenuItem icon="flag">{{ $t("report") }}</MenuItem>
				</Menu>
			</div>
		</div>
		<div class="tags">
			<Tag
				v-for="tag in tags"
				:key="tag.tagId"
				link="/search"
				:query="{ q: tag.tagId }"
			>
				<div v-if="tag.tagId >= 0" class="display-tag">
					<div v-if="tag.mainTagName">{{ tag.mainTagName }}</div>
					<div v-if="tag.originTagName" class="original-tag-name">{{ tag.originTagName }}</div>
				</div>
			</Tag>
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
		gap: 10px;
	}

	.data {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		margin-left: -4px;
	}

	h1 {
		font-size: 24px;
		font-weight: bold;
		user-select: text;

		@include mobile {
			font-size: 20px;
		}
	}

	.actions {
		display: flex;
		margin: -12px;
		margin-bottom: -8px;

		@include not-mobile {
			gap: 16px;
		}

		@include mobile {
			justify-content: space-between;
			margin: -8px 0;
		}

		> div {
			display: flex;

			@include mobile {
				display: contents;
			}

			> div {
				@include flex-center;
				gap: 0;

				@include mobile {
					flex-direction: column;
				}
			}
		}

		.main {
			@include not-mobile {
				gap: 16px;
			}
		}

		.extra .contents {
			display: none; // 防止菜单使 space-between 不正常显示。
		}

		.soft-button {
			--wrapper-size: 48px;
			--ripple-size: var(--wrapper-size);

			@include mobile {
				--wrapper-size: 64px;

				&:deep(.icon) {
					translate: 0 -10px;
				}
			}

			+ * {
				color: c(icon-color);
				font-weight: 600;
				font-variant-numeric: tabular-nums;

				@include mobile {
					height: 0;
					font-size: 12px;
					translate: 0 -30px;
					pointer-events: none;
				}
			}

			&.router-link-active + * {
				color: c(accent);
			}
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.add-tag {
			aspect-ratio: 1 / 1;
			padding: 6px;
			color: c(icon-color);
			font-size: 18px;
		}
	}

	.display-tag {
		display: flex;
		flex-direction: row;

		.original-tag-name {
			padding-left: 0.5em;
			color: c(text-color, 50%);
		}
	}

	@include not-mobile {
		.pe {
			display: none;
		}
	}

	@include mobile {
		.pc {
			display: none;
		}
	}
</style>

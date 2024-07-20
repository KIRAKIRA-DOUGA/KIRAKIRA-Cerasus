<script setup lang="ts">
	const props = defineProps<{
		/** 视频 ID。 */
		videoId: number;
		/** 视频评分。 */
		rating: number;
		/** 当前视频时间。 */
		currentTime: number;
		/** 视频是否正在播放？ */
		playing: boolean;
		/** 视频封面地址。 */
		thumbnail: string;
		/** 视频播放器设置。 */
		settings: PlayerVideoSettings;
	}>();

	const selfUserInfoStore = useSelfUserInfoStore();
	const sendDanmaku = defineModel<DanmakuComment[]>("sendDanmaku");
	const insertDanmaku = defineModel<DanmakuListItem[]>("insertDanmaku");

	const counts = reactive({
		play: 100n,
		rating: props.rating,
		favorite: 100n,
		danmaku: 10000n,
		watching: 1n,
	});

	/**
	 * 收藏视频。
	 */
	function favorite() {
		if (selfUserInfoStore.isLogined)
			useToast("抱歉，收藏功能正在制作中，请稍等~", "warning", 5000); // TODO: 使用多语言 // DELETE 请在收藏功能完成后删除该提示
		else
			useEvent("app:requestLogin");
	}

	/**
	 * 为当前视频加分。
	 */
	function upvote() {
		// const oapiClient = useApi();
		// await oapiClient.upvoteVideo(props.videoId, 1);
		counts.rating++;
	}

	/**
	 * 为当前视频减分。
	 */
	function downvote() {
		// const oapiClient = useApi();
		// await oapiClient.upvoteVideo(props.videoId, -1);
		counts.rating--;
	}

	/**
	 * 分享视频。
	 */
	function share() {
		navigator.share({
			title: document.title,
			text: "KIRAKIRA☆DOUGA", // XXX: 这里得放页面的 title。
			url: location.href,
		});
	}

	const showTabBar = ref(false);
	const showSettings = ref(false);
	const selectedTab = ref("danmaku-list");
	const selectedSettingsTab = ref("player");
	const transitionName = ref("page-jump");

	const [DefineCountItem, CountItem] = createReusableTemplate<{
		value: number | string;
		icon: DeclaredIcons;
	}>();
</script>

<template>
	<DefineCountItem v-slot="{ value, icon, $slots }">
		<div>
			<Icon :name="icon" />
			<span>
				<component :is="$slots.default!" />
				<span class="value">{{ value }}</span>
			</span>
		</div>
	</DefineCountItem>

	<Comp>
		<div class="top">
			<div class="info">
				<CountItem v-tooltip:bottom="t(counts.play).watched" icon="play" :value="getCompactDecimal(counts.play)" />
				<CountItem v-tooltip:bottom="t(counts.danmaku).danmaku" icon="danmaku" :value="getCompactDecimal(counts.danmaku)" />
				<CountItem v-tooltip:bottom="t.rating" icon="thumb_up" :value="getCompactDecimal(counts.rating)" :class="{ downvote: counts.rating < 0 }" />
				<CountItem v-tooltip:bottom="t(counts.favorite).favorite" icon="star" :value="getCompactDecimal(counts.favorite)" />
				<!-- <div class="watching">
					<span class="watching-number">{{ counts.watching }}</span>
					<span class="watching-description">{{ t(counts.watching).are_watching }}</span>
				</div> -->
			</div>
			<div class="buttons">
				<SoftButton v-tooltip:bottom="t.upvote" icon="thumb_up" class="button-upvote" @click="upvote" />
				<SoftButton v-tooltip:bottom="t.downvote" icon="thumb_down" class="button-downvote" @click="downvote" />
				<SoftButton v-tooltip:bottom="t.favorite_verb" icon="star" class="button-favorite" @click="favorite" />
				<SoftButton v-tooltip:bottom="t.share" icon="share" class="button-share" @click="share" />
				<SoftButton v-tooltip:bottom="t.danmaku.history" icon="history" class="button-history" />
				<SoftButton v-tooltip:bottom="t.settings" :icon="showSettings ? 'close' : 'settings'" class="button-settings" :active="showSettings" @click="showSettings = !showSettings" />
			</div>
			<Transition>
				<div v-if="showTabBar || showSettings" class="tab-wrapper">
					<Transition name="page-jump">
						<TabBar v-if="showTabBar && !showSettings" v-model="selectedTab" @movingForTransition="name => transitionName = name">
							<TabItem id="danmaku-list">弹幕列表</TabItem>
							<TabItem id="chapters">分段章节</TabItem>
							<TabItem id="playlist">播放列表「」</TabItem>
						</TabBar>
						<TabBar v-else-if="showSettings" v-model="selectedSettingsTab" @movingForTransition="name => transitionName = name">
							<TabItem id="player">{{ t.player }}</TabItem>
							<TabItem id="filters">{{ t.player.filter }}</TabItem>
							<TabItem id="block-words">屏蔽词</TabItem>
						</TabBar>
					</Transition>
				</div>
			</Transition>
		</div>
		<div class="content">
			<Transition name="page-jump">
				<div v-if="!showSettings" class="pages-wrapper">
					<Transition :name="transitionName" mode="out-in">
						<div v-if="selectedTab === 'danmaku-list'" key="danmaku-list">
							<PlayerVideoPanelDanmakuList v-model="insertDanmaku" />
							<PlayerVideoPanelDanmakuSender v-model="sendDanmaku" :videoId="props.videoId" :currentTime />
						</div>

						<div v-else-if="selectedTab === 'chapters'" key="chapters">
						</div>

						<div v-else-if="selectedTab === 'playlist'" key="playlist">
						</div>
					</Transition>
				</div>

				<PlayerVideoPanelSettings
					v-else
					:playing
					:thumbnail
					:settings
					:selectedSettingsTab
					:transitionName
				/>
			</Transition>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$panel-width: 350px;
	$info-height: 36px;
	$buttons-height: 48px;

	:comp {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: $panel-width;
		height: inherit;
		overflow: clip;

		@include tablet {
			display: none;
		}
	}

	.top {
		@include card-in-card-shadow;
		z-index: 2;
		background-color: c(surface-color);

		.tab-wrapper {
			height: 36px;
			overflow: clip;

			&.v-enter-active,
			&.v-leave-active {
				transition: all $ease-out-smooth 600ms;
			}

			&.v-enter-from,
			&.v-leave-to {
				height: 0;
			}
		}

		.tab-bar {
			--full: true;
			--clipped: true;
		}
	}

	.info {
		display: grid;
		// grid-auto-flow: column;
		grid-template-columns: repeat(4, 1fr);
		width: 100%;
		height: $info-height;
		margin-top: 4px;
		color: c(icon-color);

		> :deep(*) {
			@include flex-center;
			gap: 4px;

			.icon {
				font-size: 20px;
			}

			.value {
				display: inline-block;
				min-width: 3ch;
				margin-left: 0.2em;
				text-align: center;
				user-select: text;
			}

			&.downvote .icon {
				rotate: 0.5turn;
			}
		}

		> .watching {
			flex-direction: column;
			grid-row: 1 / -1;

			.watching-number {
				font-size: 24px;
				font-weight: 500;
			}
		}
	}

	.buttons {
		@include flex-center;
		justify-content: space-evenly;
		height: $buttons-height;
		overflow: clip;
	}

	.content {
		@include square(100%);
	}

	.pages-wrapper {
		@include square(100%);
		display: flex;
	}

	.pages-wrapper > * {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
</style>

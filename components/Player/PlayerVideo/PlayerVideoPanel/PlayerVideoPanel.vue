<script setup lang="ts">
	import NumberFlow from "@number-flow/vue";

	const props = defineProps<{
		/** 视频 ID。 */
		videoId: number;
		/** 当前视频时间。 */
		currentTime: number;
		/** 视频是否正在播放？ */
		playing: boolean;
		/** 视频封面地址。 */
		thumbnail: string;
		/** 视频播放器设置。 */
		settings: PlayerVideoSettings;
	}>();

	const insertDanmaku = defineModel<DanmakuListItem[]>("insertDanmaku");

	/** @deprecated - 测试数据。 */
	const counts = reactive({
		danmaku: 10000n,
		watching: 1n,
	});

	const showTabBar = ref(false);
	const showSettings = ref(false);
	const selectedTab = ref("danmaku-list");
	const selectedSettingsTab = ref("player");
	const transitionName = ref("page-jump-in");

	const [DefineCountItem, CountItem] = createReusableTemplate<{
		value: number | string;
		icon: DeclaredIcons;
	}>();
</script>

<template>
	<DefineCountItem v-slot="{ value, icon, $slots }">
		<div class="count-item">
			<Icon :name="icon" />
			<span>
				<component :is="$slots.default!" />
				<NumberFlow class="value" :value="value" />
			</span>
		</div>
	</DefineCountItem>

	<Comp>
		<div class="top">
			<div class="top-bar">
				<div class="counts">
					<CountItem v-tooltip:bottom="$t('danmaku.title', insertDanmaku?.length ?? 0)" icon="danmaku" :value="getCompactDecimal(insertDanmaku?.length ?? 0)" />
				</div>
				<div class="buttons">
					<SoftButton v-tooltip:bottom="$t('danmaku.history')" icon="history" class="button-history" />
					<SoftButton v-tooltip:bottom="$t('settings.title')" :icon="showSettings ? 'close' : 'settings'" class="button-settings" :active="showSettings" @click="showSettings = !showSettings" />
				</div>
			</div>
			<Transition>
				<div v-if="showTabBar || showSettings" class="tab-wrapper">
					<Transition :name="showSettings ? 'page-jump-out' : 'page-jump-in'" mode="out-in">
						<TabBar v-if="showTabBar && !showSettings" v-model="selectedTab" @movingForTransition="name => transitionName = name">
							<TabItem id="danmaku-list">{{ $t("danmaku.title", 2) }}</TabItem>
							<TabItem id="chapters">分段章节</TabItem>
							<TabItem id="playlist">播放列表</TabItem>
						</TabBar>
						<TabBar v-else-if="showSettings" v-model="selectedSettingsTab" @movingForTransition="name => transitionName = name">
							<TabItem id="player">{{ $t("player.title") }}</TabItem>
							<TabItem id="filters">{{ $t("player.filter.title") }}</TabItem>
							<TabItem id="block-words">屏蔽词</TabItem>
						</TabBar>
					</Transition>
				</div>
			</Transition>
		</div>
		<div class="content">
			<Transition :name="showSettings ? 'page-jump-out' : 'page-jump-in'" mode="out-in">
				<div v-if="!showSettings" class="pages-wrapper">
					<Transition :name="transitionName" mode="out-in">
						<div v-if="selectedTab === 'danmaku-list'" key="danmaku-list">
							<slot name="danmaku"></slot>
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
	$info-height: 36px;
	$buttons-height: 48px;

	:comp {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		height: 100%;
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

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 56px;
		padding: 4px;

		.counts {
			@include flex-center;
			gap: 4px;
			margin-left: 12px;
		}

		.count-item {
			@include flex-center;
			gap: 8px;
			color: c(icon-color);

			.icon {
				font-size: 24px;
			}

			.value {
				display: inline-block;
				min-width: 1ch;
				margin-left: 0.2em;
				font-weight: 600;
				user-select: text;
			}
		}

		.soft-button {
			--wrapper-size: 48px;
			--ripple-size: var(--wrapper-size);
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
		width: 100%;
	}
</style>

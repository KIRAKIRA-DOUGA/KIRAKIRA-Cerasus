<script setup lang="ts">
	const props = defineProps<{
		/** 视频 ID。 */
		videoId: number;
		/** 视频评分。 */
		rating: number;

		getTime: Function;
	}>();

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
		useEvent("app:requestLogin");
	}

	/**
	 * 为当前视频加分。
	 */
	async function upvote() {
		const oapiClient = useApi();
		await oapiClient.upvoteVideo(props.videoId, 1);
		counts.rating++;
	}

	/**
	 * 为当前视频减分。
	 */
	async function downvote() {
		const oapiClient = useApi();
		await oapiClient.upvoteVideo(props.videoId, -1);
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
				<CountItem icon="play" :value="getWatchCount(counts.play)">{{ t(counts.play).views_video }}</CountItem>
				<CountItem icon="thumb_up" :value="getWatchCount(counts.rating)" :class="{ downvote: counts.rating < 0 }">{{ t.rating }}</CountItem>
				<CountItem icon="star" :value="getWatchCount(counts.favorite)">{{ t(counts.favorite).favorite }}</CountItem>
				<CountItem icon="danmaku" :value="getWatchCount(counts.danmaku)">{{ t(counts.danmaku).danmaku }}</CountItem>
				<div class="watching">
					<span class="watching-number">{{ counts.watching }}</span>
					<span class="watching-description">{{ t(counts.watching).are_watching }}</span>
				</div>
			</div>
			<div class="buttons">
				<SoftButton v-tooltip:bottom="t.upvote" icon="thumb_up" class="button-upvote" @click="upvote" />
				<SoftButton v-tooltip:bottom="t.downvote" icon="thumb_down" class="button-downvote" @click="downvote" />
				<SoftButton v-tooltip:bottom="t.favorite_verb" icon="star" class="button-favorite" @click="favorite" />
				<SoftButton v-tooltip:bottom="t.share" icon="share" class="button-share" @click="share" />
				<SoftButton v-tooltip:bottom="t.danmaku.history" icon="history" class="button-history" />
				<SoftButton v-tooltip:bottom="t.settings" icon="settings" class="button-settings" />
			</div>
		</div>
		<PlayerVideoPanelDanmakuList v-model="insertDanmaku" />
		<PlayerVideoPanelDanmakuSender v-model="sendDanmaku" :videoId="props.videoId" :getTime="props.getTime" />
	</Comp>
</template>

<style scoped lang="scss">
	$panel-width: 350px;
	$info-height: 80px;
	$buttons-height: 48px;

	:comp {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: $panel-width;
		height: inherit;
		overflow: hidden;

		@include tablet {
			display: none;
		}
	}

	.top {
		@include card-in-card-shadow;
	}

	.info {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, 1fr);
		width: 100%;
		height: $info-height;
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
			}

			&.downvote .icon {
				rotate: 0.5turn;
			}
		}

		> .watching {
			flex-direction: column;
			grid-row: 1 / -1;

			.watching-number {
				font-weight: 500;
				font-size: 24px;
			}
		}
	}

	.buttons {
		@include flex-center;
		justify-content: space-evenly;
		height: $buttons-height;
		overflow: hidden;
	}
</style>

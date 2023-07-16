<script setup lang="ts">
	import mediainfo from "mediainfo.js";

	import { ref } from "vue";
	import videojs from "video.js";

	const props = defineProps<{
		src: string;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const buffered = ref(0);
	const isTimeUpdating = ref(false);
	const showMediaInfo = ref(false);
	const mediaInfos = ref<MediaInfo>();
	const video = ref<HTMLVideoElement>();
	const { isFullscreen: fullScreen, toggle } = useFullscreen(video);
	const menu = ref<MenuModel>();

	type MediaInfo = Record<string, Record<string, unknown>>;

	/**
	 * 显示视频详细信息。
	 */
	async function showInfo() {
		if (!mediaInfos.value) await getInfo(props.src);
		if (mediaInfos.value) showMediaInfo.value = true;
	}

	const player = ref(null);

	onMounted(() => {
		player.value = videojs(player.value,
			{
				controls: true,
				sources: [
					{
						src: props.src,
						type: "application/dash+xml",
					},
				],
			}, () => {
				player.value.log("onPlayerReady", player.value);
			});
	});

	onBeforeUnmount(() => {
		if (player.value != null)
			player.value.dispose();
	});

	/**
	 * 获取视频详细信息，使用库 `mediainfo.js`。
	 * @param videoPath - 视频地址。
	 */
	async function getInfo(videoPath: string) {
		const response = await fetch(videoPath);
		const blob = await response.blob();
		const fileName = path.basename(videoPath);
		const file = new File([blob], fileName);
		const mediaInfo = await mediainfo();
		const result = await mediaInfo.analyzeData(() => file.size,
			(chunkSize, offset) => new Promise<Uint8Array>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
				reader.onerror = reject;
				reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
			}));
		if (typeof result === "string") return; // 仅在会报错时 result 取值为空字符串，如报错在此之前已会报错，忽略之。
		const tracks = result.media.track;
		mediaInfos.value = {};
		for (const track of tracks) {
			const { "@type": type, ...info } = track;
			mediaInfos.value[type] = info;
		}
		showMediaInfo.value = true;
	}
</script>

<template>
	<meta charset="UTF-8" />
	<Comp>
		<Alert v-model="showMediaInfo" title="视频详细信息">
			<Accordion>
				<AccordionItem v-for="(info, type) in mediaInfos" :key="type" :title="type" noPadding>
					<table>
						<thead>
							<th>项目</th>
							<th>值</th>
						</thead>
						<tbody>
							<tr v-for="(value, property) in info" :key="property">
								<td>{{ property }}</td>
								<td>{{ value }}</td>
							</tr>
						</tbody>
					</table>
				</AccordionItem>
			</Accordion>
		</Alert>

		<div class="main">
			<video
				ref="player"
				class="video-js"
			>
			</video>
		</div>

		<PlayerVideoPanel />
		<Menu v-model="menu">
			<MenuItem icon="info" @click="showInfo">查看视频详细信息</MenuItem>
		</Menu>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include player-shadow;
		display: flex;
		flex-direction: row;
		background-color: c(surface-color);
	}

	.main,
	video {
		width: 100%;
	}

	table {
		border-radius: 0;
	}
</style>

<script setup lang="ts">
	const props = defineProps<{
		/** 视频是否正在播放？ */
		playing?: boolean;
		/** 视频封面地址。 */
		thumbnail: string;
		/** 视频播放器设置。 */
		settings: PlayerVideoSettings;
	}>();

	type Filters = keyof PlayerVideoSettings["filter"] | "rotate90" | "rotate180" | "rotate270" | "hMirrorLeft" | "hMirrorRight" | "vMirrorTop" | "vMirrorBottom";

	/* TODO: 多语言。 */
	const filters: Record<Exclude<Filters, "rotation" | "mirror">, string> = {
		hFlip: "水平翻转",
		vFlip: "垂直翻转",
		rotate90: "旋转90°",
		rotate180: "旋转180°",
		rotate270: "旋转270°",
		hMirrorLeft: "水平镜像（左）",
		hMirrorRight: "水平镜像（右）",
		vMirrorTop: "垂直镜像（上）",
		vMirrorBottom: "垂直镜像（下）",
		grayscale: "黑白",
		invert: "反色",
		sepia: "怀旧",
		hue: "调整色相",
		saturate: "调整饱和度",
		contrast: "调整对比度",
		brightness: "调整亮度",
	};

	const filterBooleanProxy = new Proxy(props.settings.filter, {
		get(target, prop: Filters) {
			const propOriginal = (prop.startsWith("rotate") ? "rotation" : prop.includes("Mirror") ? "mirror" : prop) as keyof PlayerVideoSettings["filter"];
			const value = target[propOriginal];
			return ({
				rotate90: value === 90,
				rotate180: value === 180,
				rotate270: value === 270,
				hMirrorLeft: value === "left",
				hMirrorRight: value === "right",
				vMirrorTop: value === "top",
				vMirrorBottom: value === "bottom",
				hue: value as number % 360 !== 0,
				saturate: value !== 1,
				contrast: value !== 1,
				brightness: value !== 1,
			} as Record<Filters, boolean>)[prop] ?? value as boolean;
		},
		set(target, prop: Filters, newValue: boolean) {
			if (prop.startsWith("rotate")) {
				if (!newValue) target.rotation = 0;
				else {
					const rotation = +prop.match(/\d+$/)![0];
					target.rotation = rotation as never;
				}
				return true;
			} else if (prop.includes("Mirror")) {
				const side = prop.match(/Mirror(.+)$/)?.[1];
				if (!newValue || !side) target.mirror = false;
				else target.mirror = side.toLowerCase() as never;
			}
			/* eslint-disable @stylistic/indent */
			prop === "hue" ? target.hue = newValue ? 180 : 0 :
			prop === "saturate" ? target.saturate = newValue ? 5 : 1 :
			prop === "contrast" ? target.contrast = newValue ? 5 : 1 :
			prop === "brightness" ? target.brightness = newValue ? 2 : 1 :
			target[prop as never] = newValue as never;
			/* eslint-enable @stylistic/indent */
			return true;
		},
	}) as unknown as Record<Filters, boolean>;

	const selectedSettingsTab = defineModel<string>("selectedSettingsTab", { default: "player" });
	const blockWordsToggle = ref(false);
	const blockWordsSelectedTab = ref("block-keywords");
	const transitionName = defineModel<string>("transitionName", { default: "page-jump-in" });
	/** Firefox 可能永远不会支持该属性，因此移除显示。 */
	const supportMirror = computed(() => environment.server ? true : CSS.supports("-webkit-box-reflect", "right"));
</script>

<template>
	<div class="wrapper">
		<Comp>
			<ScrollContainer overflowX="clip">
				<Transition :name="transitionName" mode="out-in">
					<div v-if="selectedSettingsTab === 'player' " class="page-player">
						<!-- TODO: 需详细阐述是自动播放啥？分 P、合集的下一集、还是相关视频？ -->
						<ToggleSwitch v-model="settings.autoplay" v-ripple icon="autoplay">{{ $t("player.autoplay") }}</ToggleSwitch>
						<p class="subheading">{{ $t("danmaku.title") }}</p>
						<!-- TODO: 检查字号缩放功能的可用性并显示缩放数值。 -->
						<SettingsSlider
							v-model="settings.danmaku.fontSizeScale"
							:min="0"
							:max="2"
							:defaultValue="1"
							icon="font_size"
						>{{ $t("text.size") }}</SettingsSlider>
						<SettingsSlider
							v-model="settings.danmaku.opacity"
							:min="0"
							:max="1"
							:defaultValue="1"
							icon="opacity"
						>{{ $t("opacity") }}</SettingsSlider>
						<p class="subheading">{{ $t("player.control_bar.title") }}</p>
						<ToggleSwitch v-model="settings.controller.showStop" v-ripple icon="stop">
							{{ !settings.controller.showFrameByFrame ? $t("player.control_bar.stop") : $t("player.control_bar.first_last_frame") }}
							<template #details>{{ !settings.controller.showFrameByFrame ? $t("player.control_bar.stop_description") : $t("player.control_bar.first_last_frame_description") }}</template>
						</ToggleSwitch>
						<ToggleSwitch v-model="settings.controller.showReplay" v-ripple icon="replay">
							{{ $t("player.control_bar.replay") }}
							<template #details>{{ $t("player.control_bar.replay_description") }}</template>
						</ToggleSwitch>
						<ToggleSwitch v-model="settings.controller.showFrameByFrame" v-ripple icon="slow_forward">
							{{ $t("player.control_bar.frame_by_frame") }}
							<template #details>{{ $t("player.control_bar.frame_by_frame_description") }}</template>
						</ToggleSwitch>
						<ToggleSwitch v-model="settings.controller.autoResumePlayAfterSeeking" v-ripple icon="play">
							{{ $t("player.control_bar.auto_resume_play_after_seeking") }}
						</ToggleSwitch>
					</div>

					<div v-else-if="selectedSettingsTab === 'filters'">
						<div class="grid">
							<template v-for="(filter, key) in filters" :key="key">
								<CheckCard v-if="!(key.includes('Mirror') && !supportMirror)" v-model="filterBooleanProxy[key]">
									{{ filter }}
									<template #image>
										<NuxtImg
											class="filter-card"
											:class="new VariableName(key).kebab"
											:provider="environment.cloudflareImageProvider"
											:src="thumbnail"
											:alt="`preview-${filter}`"
											:draggable="false"
											format="avif"
											width="200"
											height="200"
										/>
									</template>
								</CheckCard>
							</template>
						</div>
					</div>

					<div v-else-if="selectedSettingsTab === 'block-words'">
						<!-- TODO: 使用多语言 -->
						<ToggleSwitch v-model="blockWordsToggle" v-ripple icon="visibility_off">开启屏蔽</ToggleSwitch>

						<TabBar v-model="blockWordsSelectedTab">
							<TabItem id="block-keywords">屏蔽文本</TabItem>
							<TabItem id="block-regex">屏蔽正则</TabItem>
							<TabItem id="block-users">屏蔽用户</TabItem>
						</TabBar>
					</div>
				</Transition>
			</ScrollContainer>
		</Comp>
		<ShadingIcon icon="settings" position="right bottom" rotating :elastic="playing" size="large" />
	</div>
</template>

<style scoped lang="scss">
	$padding: 16px;
	$icon-size: 24px;
	$gap: 16px;

	:comp {
		position: relative;
		z-index: 11;
		flex-grow: 1;
		height: 100%;
		contain: strict;

		> .scroll-container {
			height: 100%;

			&:deep(.scroller) {
				overscroll-behavior: contain;
			}
		}
	}

	.wrapper {
		@include square(100%);
		position: relative;
	}

	.tab-bar {
		--full: true;
	}

	.shading-icon {
		position: absolute;
	}

	p.subheading {
		display: flex;
		align-items: center;
		height: 36px;
		padding-left: $padding + $icon-size + $gap;
		color: c(accent);
		font-weight: 600;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		padding: 16px;

		.check-card {
			--width: 100%;
			--height: unset;
			--aspect-ratio: 1 / 1;
			--float-offset: 6px;
		}
	}

	.toggle-switch {
		padding-block: 12px;
		padding-inline: $padding;

		&:deep(.icon) {
			margin-right: $gap;
			font-size: $icon-size;
		}

		p.subheading + & {
			margin-block-start: 0;
		}
	}

	.filter-card {
		&.h-flip { scale: -1 1; }
		&.v-flip { scale: 1 -1; }
		&.rotate-90 { rotate: 90deg; }
		&.rotate-180 { rotate: 180deg; }
		&.rotate-270 { rotate: 270deg; }
		&.h-mirror-left { @include mirror(left); }
		&.h-mirror-right { @include mirror(right); translate: 100%; }
		&.v-mirror-top { @include mirror(top); }
		&.v-mirror-bottom { @include mirror(bottom); translate: 0 100%; }
		&.grayscale { filter: grayscale(1); }
		&.invert { filter: invert(1); }
		&.sepia { filter: sepia(1); }
		&.hue { filter: hue-rotate(180deg); }
		&.saturate { filter: saturate(5); }
		&.contrast { filter: contrast(5); }
		&.brightness { filter: brightness(2); }
	}
</style>

<script setup lang="ts">
	const props = defineProps<{
		/** 视频是否正在播放？ */
		playing?: boolean;
		/** 视频封面地址。 */
		thumbnail: string;
		/** 视频播放器设置。 */
		settings: PlayerVideoSettings;
	}>();
</script>

<template>
	<Comp>
		<ShadingIcon icon="settings" position="right bottom" rotating :elastic="playing" large />

		<p>弹幕</p>
		<SettingsSlider
			v-model="settings.danmaku.fontSizeScale"
			:min="0"
			:max="2"
			:defaultValue="1"
			icon="font_size"
		>字号缩放</SettingsSlider>
		<SettingsSlider
			v-model="settings.danmaku.opacity"
			:min="0"
			:max="1"
			:defaultValue="1"
			icon="opacity"
		>不透明度</SettingsSlider>

		<p>滤镜</p>
		<ToggleSwitch v-model="settings.filter.horizontalFlip" v-ripple icon="flip_horizontal">水平翻转</ToggleSwitch>
		<ToggleSwitch v-model="settings.filter.verticalFlip" v-ripple icon="flip_vertical">垂直翻转</ToggleSwitch>

	</Comp>
</template>

<style scoped lang="scss">
	$padding: 16px;
	$icon-size: 24px;
	$gap: 16px;

	:comp {
		position: relative;
		flex-grow: 1;
		padding-top: 8px;
	}

	.shading-icon {
		position: absolute;
	}

	p {
		display: flex;
		align-items: center;
		height: 36px;
		padding-left: $padding + $icon-size + $gap;
		color: c(accent);
		font-weight: 600;
	}

	.toggle-switch {
		height: 48px;
		padding: 0 $padding;

		&:deep(.icon) {
			margin-right: $gap;
			font-size: $icon-size;
		}
	}
</style>

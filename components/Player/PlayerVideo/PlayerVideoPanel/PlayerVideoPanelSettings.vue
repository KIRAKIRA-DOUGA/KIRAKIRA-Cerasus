<script setup lang="ts">
	const props = defineProps<{
		/** 视频是否正在播放？ */
		playing?: boolean;
		/** 视频封面地址。 */
		thumbnail: string;
		/** 视频播放器设置。 */
		settings: PlayerVideoSettings;
	}>();

	type Filters = keyof PlayerVideoSettings["filter"] | "rotation90" | "rotation180" | "rotation270";

	const filters: Record<Exclude<Filters, "rotation">, [string, CSSProperties]> = {
		horizontalFlip: ["水平翻转", { scale: "-1 1" }],
		verticalFlip: ["垂直翻转", { scale: "1 -1" }],
		rotation90: ["旋转90°", { rotate: "90deg" }],
		rotation180: ["旋转180°", { rotate: "180deg" }],
		rotation270: ["旋转270°", { rotate: "270deg" }],
		grayscale: ["黑白", { filter: "grayscale(1)" }],
		invert: ["反转", { filter: "invert(1)" }],
		sepia: ["怀旧", { filter: "sepia(1)" }],
		hue: ["调整色相", { filter: "hue-rotate(180deg)" }],
		saturate: ["调整饱和度", { filter: "saturate(5)" }],
		contrast: ["调整对比度", { filter: "contrast(5)" }],
		brightness: ["调整亮度", { filter: "brightness(2)" }],
	};

	const filterBooleanProxy = new Proxy(props.settings.filter, {
		get(target, prop: Filters) {
			const propOriginal = (prop.startsWith("rotation") ? "rotation" : prop) as keyof PlayerVideoSettings["filter"];
			const value = target[propOriginal];
			return ({
				rotation90: value === 90,
				rotation180: value === 180,
				rotation270: value === 270,
				hue: value as number % 360 !== 0,
				saturate: value !== 1,
				contrast: value !== 1,
				brightness: value !== 1,
			} as Record<Filters, boolean>)[prop] ?? value as boolean;
		},
		set(target, prop: Filters, newValue: boolean) {
			if (prop.startsWith("rotation")) {
				if (!newValue) target.rotation = 0;
				else {
					const rotation = +prop.match(/\d+$/)![0];
					target.rotation = rotation as never;
				}
				return true;
			}
			/* eslint-disable indent */
			prop === "hue" ? (target.hue = newValue ? 180 : 0) :
			prop === "saturate" ? (target.saturate = newValue ? 5 : 1) :
			prop === "contrast" ? (target.contrast = newValue ? 5 : 1) :
			prop === "brightness" ? (target.brightness = newValue ? 2 : 1) :
			target[prop as never] = newValue as never;
			/* eslint-enable indent */
			return true;
		},
	}) as unknown as Record<Filters, boolean>;
</script>

<template>
	<div class="wrapper">
		<Comp>
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
			<div class="grid">
				<CheckCard v-for="([filter, style], key) in filters" :key="key" v-model="filterBooleanProxy[key]">
					{{ filter }}
					<template #image><img :src="thumbnail" alt="preview" :style="style" /></template>
				</CheckCard>
				<!-- <CheckCard v-model="settings.filter.horizontalFlip">
					水平翻转
					<template #image><img :src="thumbnail" alt="preview" /></template>
				</CheckCard>
				<CheckCard v-model="settings.filter.verticalFlip">
					垂直翻转
					<template #image><img :src="thumbnail" alt="preview" /></template>
				</CheckCard> -->
			</div>
		</Comp>
		<ShadingIcon icon="settings" position="right bottom" rotating :elastic="playing" large />
	</div>
</template>

<style scoped lang="scss">
	$padding: 16px;
	$icon-size: 24px;
	$gap: 16px;

	:comp {
		position: relative;
		flex-grow: 1;
		height: 100%;
		padding-top: 8px;
		contain: strict;
		overflow: hidden auto;
	}
	
	.wrapper {
		@include square(100%);
		position: relative;
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
		height: 48px;
		padding: 0 $padding;

		&:deep(.icon) {
			margin-right: $gap;
			font-size: $icon-size;
		}
	}
</style>

<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	import animationData from "lotties/spinner-dev1.json";
	import { LogoTextFormType } from "components/Logo/LogoText.vue";

	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(7);
	const toggle = ref(false);
	const isClicked = ref(false);
	const theme = Theme.theme;
	const palette = Theme.palette;
	const router = useRouter();
	const { locale: currentLocale, locales } = useI18n();
	const switchLocalePath = useSwitchLocalePath();
	const availableLocales = computed(() => (locales.value as LocaleObject[]).filter(i => i.code !== currentLocale.value));
	const timeoutId = ref<NodeJS.Timeout>();
	const isTagChecked = ref(false);
	const sliderValue = ref(0);
	const selectedTab = ref("all");
	const logoTextForm = ref<LogoTextFormType>("full");

	/**
	 * 单击按钮事件。
	 */
	async function onClickButton() {
		clearTimeout(timeoutId.value);
		isClicked.value = true;
		await new Promise(resolve => (timeoutId.value = setTimeout(resolve, 2000)));
		isClicked.value = false;
	}

	const goToVideo = () => {
		router.push("/video");
	};

	useHead({ title: "首页" });
</script>

<template>
	<div class="container">
		<div>{{ t.home }}</div>
		<div class="links">
			<LocaleLink to="/video">{{ t.video }}</LocaleLink>
			<LocaleLink to="/hello">{{ t.content }}</LocaleLink>
			<LocaleLink to="/search">{{ t.search }}</LocaleLink>
			<a href="/404">404</a>
		</div>
		<div class="component-test">
			<PageController v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
			<Button @click="onClickButton">{{ isClicked ? t.buttonClicked : t.button }}</Button>
			<Button disabled>{{ t.buttonDisabled }}</Button>
			<Button @click="showConfetti">{{ t.confetti }}</Button>
			<Button icon="send">{{ t.send }}</Button>
			<ToggleSwitch v-model="toggle">{{ t.toggleSwitch }} {{ toggle ? t.on : t.off }}</ToggleSwitch>
			<ToggleSwitch disabled>{{ t.offDisabled }} </ToggleSwitch>
			<ToggleSwitch on disabled>{{ t.onDisabled }}</ToggleSwitch>
			<RadioButton v-model="theme" value="light">{{ t.lightTheme }}</RadioButton>
			<RadioButton v-model="theme" value="dark">{{ t.darkTheme }}</RadioButton>
			<RadioButton v-model="theme" value="system">{{ t.systemTheme }}</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">{{ t.pink }}</RadioButton>
			<RadioButton v-model="palette" value="sky">{{ t.sky }}</RadioButton>
			<RadioButton v-model="palette" value="blue">{{ t.blue }}</RadioButton>
			<RadioButton v-model="palette" value="orange">{{ t.orange }}</RadioButton>
			<RadioButton v-model="palette" value="purple">{{ t.purple }}</RadioButton>
			<RadioButton v-model="palette" value="green">{{ t.green }}</RadioButton>
			<RadioButton disabled>{{ t.custom }}</RadioButton>
			<RadioButton on disabled>{{ t.onDisabled }}</RadioButton>
			<hr />
			<NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
				{{ locale.name }}
			</NuxtLink>
			<br />
			<ProgressRing />
			<!-- <Lottie loop autoplay :animationData="animationData" /> -->
			<br />
			<Tag v-model="isTagChecked">{{ t.tag }}</Tag>
			<SlideBar v-model="sliderValue" />
			<TabBar v-model="selectedTab">
				<TabItem id="all">{{ t.all }}</TabItem>
				<TabItem id="video">{{ t.video }}</TabItem>
				<TabItem id="images">{{ t.images }}</TabItem>
				<TabItem id="long">测试很长很长很长</TabItem>
				<TabItem id="short">短</TabItem>
			</TabBar>
			<br />
			<RadioButton v-model="logoTextForm" value="hidden">{{ t.logoHidden }}</RadioButton>
			<RadioButton v-model="logoTextForm" value="half">{{ t.logoHalf }}</RadioButton>
			<RadioButton v-model="logoTextForm" value="full">{{ t.logoShow }}</RadioButton>
			<LogoText :form="logoTextForm" />
			<LogoCover />
		</div>
	</div>
</template>

<i18n lang="json5">
{
	zh: {
		home: "KIRAKIRA 首页",
		video: "视频",
		content: "内容",
		search: "搜索",
		button: "按钮",
		buttonDisabled: "按钮被禁用",
		buttonClicked: "我被单击了 呜呜呜~",
		confetti: "五彩纸屑",
		send: "发送",
		toggleSwitch: "切换开关",
		on: "开",
		off: "关",
		onDisabled: "禁用 开",
		offDisabled: "禁用 关",
		lightTheme: "浅色主题",
		darkTheme: "深色主题",
		systemTheme: "跟随系统",
		pink: "萌妹粉",
		sky: "天空蓝",
		blue: "智乃蓝",
		green: "千夜绿",
		orange: "心爱橙",
		purple: "理世紫",
		custom: "自定义",
		tag: "标签",
		all: "全部",
		video: "视频",
		images: "图片",
		logoHidden: "LOGO隐藏",
		logoHalf: "LOGO半显示",
		logoShow: "LOGO全显示",
	},
	en: {
		home: "KIRAKIRA Home",
		video: "Video",
		content: "Content",
		search: "Search",
		button: "Button",
		buttonDisabled: "Button disabled",
		buttonClicked: "I was clicked~",
		confetti: "Confetti",
		send: "Send",
		toggleSwitch: "Toggle Switch",
		on: "On",
		off: "Off",
		onDisabled: "Disabled on",
		offDisabled: "Disabled off",
		lightTheme: "Light theme",
		darkTheme: "Dark theme",
		systemTheme: "Follow system theme",
		pink: "Kawaii Pink",
		sky: "Sky Blue",
		blue: "Chino Blue",
		green: "Chiya Green",
		orange: "Cocoa Orange",
		purple: "Rize Purple",
		custom: "Custom",
		tag: "Tag",
		all: "All",
		video: "Videos",
		images: "Images",
		logoHidden: "Hidden LOGO",
		logoHalf: "Half hidden LOGO",
		logoShow: "Full LOGO",
	},
	ja: {
		home: "KIRAKIRA ホーム",
		video: "動画",
		content: "コンテンツ",
		search: "検索",
		button: "ボタン",
		buttonDisabled: "無効化されたボタン",
		buttonClicked: "私はクリックされました ううっ~",
		confetti: "紙吹雪",
		send: "送信",
		toggleSwitch: "スイッチ",
		onDisabled: "無効化されたスイッチ オン",
		offDisabled: "無効化されたスイッチ オフ",
		on: "オン",
		off: "オフ",
		lightTheme: "ライトテーマ",
		darkTheme: "ダークテーマ",
		systemTheme: "システムのテーマ設定を使用する",
		pink: "カワイイ ピンク",
		sky: "空色",
		blue: "チノ 青",
		green: "千夜 緑",
		orange: "ココア オレンジ",
		purple: "リゼ 紫",
		custom: "カスタム",
		tag: "タグ",
		all: "すべて",
		video: "動画",
		images: "画像",
		logoHidden: "LOGO非表示",
		logoHalf: "LOGO部分表示",
		logoShow: "LOGO全表示",
	},
}
</i18n>

<style scoped lang="scss">
	.container {
		padding: 26px 100px;
	}

	.component-test {
		> * {
			margin: 0.8rem 0.5rem;
		}
	}

	.links {
		display: flex;
		gap: 8px;
	}

	hr {
		border: none;
		border-top: c(divider, 10%) 1px solid;
	}
</style>

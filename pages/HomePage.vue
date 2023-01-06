<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	import animationData from "lotties/spinner-dev1.json";

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

	async function onClickButton() {
		clearTimeout(timeoutId.value);
		isClicked.value = true;
		await new Promise(resolve => (timeoutId.value = setTimeout(resolve, 2000)));
		isClicked.value = false;
	}

	const goToVideo = () => {
		router.push("/VideoPlay");
	};

	useHead({ title: "首页" });
	showConfetti();
</script>

<template>
	<div class="container">
		<div>{{ t.home }}</div>
		<div class="links">
			<LocaleLink to="/VideoPlay">{{ t.video }}</LocaleLink>
			<LocaleLink to="/hello">{{ t.content }}</LocaleLink>
			<LocaleLink to="/search">{{ t.search }}</LocaleLink>
			<a href="/404">404</a>
		</div>
		<div class="component-test">
			<PageController v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
			<Button @click="onClickButton">{{ isClicked ? t.buttonClicked : t.button }}</Button>
			<Button disabled>{{ t.buttonDisabled }}</Button>
			<Button icon="send">{{ t.send }}</Button>
			<ToggleSwitch v-model="toggle">切换开关 {{ toggle ? "开" : "关" }}</ToggleSwitch>
			<ToggleSwitch disabled>禁用 关</ToggleSwitch>
			<ToggleSwitch on disabled>禁用 开</ToggleSwitch>
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
			<hr />
			<NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
				{{ locale.name }}
			</NuxtLink>
			<br />
			<ProgressRing />
			<!-- <Lottie loop autoplay :animationData="animationData" /> -->
			<br />
			<Tag v-model="isTagChecked">标签</Tag>
			<SlideBar v-model="sliderValue" />
			<TabBar>
				<TabItem>全部</TabItem>
				<TabItem>视频</TabItem>
				<TabItem>图片</TabItem>
			</TabBar>
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
		send: "发送",
		lightTheme: "浅色主题",
		darkTheme: "深色主题",
		systemTheme: "使用默认值",
		pink: "萌妹粉",
		sky: "天空蓝",
		blue: "智乃蓝",
		green: "千夜绿",
		orange: "心爱橙",
		purple: "理世紫",
	},
	en: {
		home: "KIRAKIRA Home",
		video: "Video",
		content: "Content",
		search: "Search",
		button: "Button",
		buttonDisabled: "Button disabled",
		buttonClicked: "I was clicked~",
		send: "Send",
		lightTheme: "Light",
		darkTheme: "Dark",
		systemTheme: "System",
		pink: "Kawaii Pink",
		sky: "Sky Blue",
		blue: "Chino Blue",
		green: "Chiya Green",
		orange: "Cocoa Orange",
		purple: "Rize Purple",
	},
	ja: {
		home: "KIRAKIRA ホーム",
		video: "動画",
		content: "内容",
		search: "検索",
		button: "ボタン",
		buttonDisabled: "ボタン無効",
		buttonClicked: "私はクリックされました ううう~",
		send: "送信",
		lightTheme: "ライト",
		darkTheme: "暗い",
		systemTheme: "自動",
		pink: "かわいい ピンク",
		sky: "空色",
		blue: "チノ 青",
		green: "千夜 緑",
		orange: "ココア オレンジ",
		purple: "リゼ 紫",
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

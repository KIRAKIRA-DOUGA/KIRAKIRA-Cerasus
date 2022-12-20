<script setup lang="ts">
	import animationData from "lotties/spinner-dev1.json";

	const page = ref(1);
	const pages = ref(99);
	const displayPageCount = ref(7);
	const toggle = ref(false);
	const isClicked = ref(false);
	const theme = Theme.themeSet;
	const palette = Theme.palette;
	const router = useRouter();
	const t = locale();
	const switchLocalePath = useSwitchLocalePath();

	async function onClickButton() {
		isClicked.value = true;
		await delay(2000);
		isClicked.value = false;
	}

	const goToVideo = () => {
		router.push("/VideoPlay");
	};

	useHead({ title: "首页" });
	showConfetti();
</script>

<template>
	<div class="kirakira-home-page-box">
		<div>{{ t("home") }}</div>
		<a @click="goToVideo">{{ t("video") }}</a>
		<div class="component-test">
			<PageController :pages="pages" :displayPageCount="displayPageCount" :current="page" enableArrowKeyMove @changePage="e => page = e.page" />
			<Button @click="onClickButton">{{ isClicked ? t("buttonClicked") : t("button") }}</Button>
			<Button disabled>{{ t("buttonDisabled") }}</Button>
			<ToggleSwitch v-model:on="toggle">切换开关 {{ toggle ? "开" : "关" }}</ToggleSwitch>
			<ToggleSwitch disabled>禁用 关</ToggleSwitch>
			<ToggleSwitch on disabled>禁用 开</ToggleSwitch>
			<RadioButton v-model="theme" value="light">{{ t("lightTheme") }}</RadioButton>
			<RadioButton v-model="theme" value="dark">{{ t("darkTheme") }}</RadioButton>
			<RadioButton v-model="theme" value="system">{{ t("systemTheme") }}</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">{{ t("pink") }}</RadioButton>
			<RadioButton v-model="palette" value="cyan">{{ t("cyan") }}</RadioButton>
			<hr />
			<NuxtLink :to="switchLocalePath('zh')">简体中文</NuxtLink>
			<NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
			<NuxtLink :to="switchLocalePath('ja')">日本語</NuxtLink>
			<br />
			<ProgressRing />
			<Lottie loop autoplay :animationData="animationData" />
			<LogoCover />
		</div>
	</div>
</template>

<i18n lang="js">
{
	zh: {
		home: "KIRAKIRA 首页",
		video: "视频",
		button: "按钮",
		buttonDisabled: "按钮被禁用",
		buttonClicked: "我被单击了 呜呜呜~",
		lightTheme: "浅色主题",
		darkTheme: "深色主题",
		systemTheme: "使用默认值",
		pink: "玫瑰粉",
		cyan: "智乃蓝",
	},
	en: {
		home: "KIRAKIRA Home",
		video: "Video",
		button: "Button",
		buttonDisabled: "Button disabled",
		buttonClicked: "I was clicked~",
		lightTheme: "Light",
		darkTheme: "Dark",
		systemTheme: "System",
		pink: "Rose Pink",
		cyan: "Chino Cyan",
	},
	ja: {
		home: "KIRAKIRA ホーム",
		video: "動画",
		button: "ボタン",
		buttonDisabled: "ボタン無効",
		buttonClicked: "私はクリックされました ううう~",
		lightTheme: "ライト",
		darkTheme: "暗い",
		systemTheme: "自動",
		pink: "薔薇 ピンク",
		cyan: "チノ 青",
	},
}
</i18n>

<style scoped lang="scss">
	.kirakira-home-page-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #001eff0d; // TODO: 魔色待修改。
	}

	.component-test {
		padding: 1rem;

		> * {
			margin: 0.8rem 0.5rem;
		}
	}
</style>

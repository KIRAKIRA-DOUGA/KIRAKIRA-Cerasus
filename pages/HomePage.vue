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
		<div>kirakira home</div>
		<a @click="goToVideo">video</a>
		<div class="component-test">
			<PageController :pages="pages" :displayPageCount="displayPageCount" :current="page" enableArrowKeyMove @changePage="e => page = e.page" />
			<Button @click="onClickButton">{{ isClicked ? "我被单击了 呜呜呜~" : "按钮" }}</Button>
			<Button disabled>按钮被禁用</Button>
			<ToggleSwitch v-model:on="toggle">切换开关 {{ toggle ? "开" : "关" }}</ToggleSwitch>
			<ToggleSwitch disabled>禁用 关</ToggleSwitch>
			<ToggleSwitch on disabled>禁用 开</ToggleSwitch>
			<RadioButton v-model="theme" value="light">浅色主题</RadioButton>
			<RadioButton v-model="theme" value="dark">深色主题</RadioButton>
			<RadioButton v-model="theme" value="auto">使用默认值</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">玫瑰粉</RadioButton>
			<RadioButton v-model="palette" value="cyan">智乃蓝</RadioButton>
			<ProgressRing />
			<Lottie loop autoplay :animationData="animationData" />
			<LogoCover />
		</div>
	</div>
</template>

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

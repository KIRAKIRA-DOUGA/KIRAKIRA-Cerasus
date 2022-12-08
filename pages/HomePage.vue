<script setup lang="ts">
	const page = ref(1);
	const toggle = ref(false);
	const isClicked = ref(false);
	const theme = ref<"light" | "dark">("light");
	const palette = ref<"pink" | "cyan">("pink");

	const router = useRouter();

	async function onClickButton() {
		isClicked.value = true;
		await delay(2000);
		isClicked.value = false;
	}

	const goToVideo = () => {
		router.push("/VideoPlay");
	};

	onUpdated(() => {
		useHead({ title: "首页", htmlAttrs: { "data-theme": theme.value, "data-palette": palette.value } });
	});

	onMounted(() => {
		showConfetti();
	});
</script>

<template>
	<div class="kirakira-home-page-box">
		<div>
			kirakira home
		</div>
		<div @click="goToVideo">
			video
		</div>
		<div class="component-test">
			<PageController :pages="99" :displayPageCount="7" :current="page" enableArrowKeyMove @changePage="e => page = e.page" />
			<Button @click="onClickButton">{{ isClicked ? "我被单击了 呜呜呜~" : "按钮" }}</Button>
			<Button disabled>按钮被禁用</Button>
			<ToggleSwitch v-model:on="toggle">切换开关 {{ toggle ? "开" : "关" }}</ToggleSwitch>
			<ToggleSwitch disabled>禁用 关</ToggleSwitch>
			<ToggleSwitch on disabled>禁用 开</ToggleSwitch>
			<RadioButton v-model="theme" value="light">浅色主题</RadioButton>
			<RadioButton v-model="theme" value="dark">深色主题</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">玫瑰粉</RadioButton>
			<RadioButton v-model="palette" value="cyan">智乃蓝</RadioButton>
			<ProgressRing />
			<LogoCover />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.kirakira-home-page-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #001eff0d;
	}

	.component-test {
		padding: 1rem;

		> * {
			margin: 0.25rem 0.5rem;
		}
	}
</style>

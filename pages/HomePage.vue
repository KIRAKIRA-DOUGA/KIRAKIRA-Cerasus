<script setup lang="ts">
	const page = ref(1);
	const toggle = ref(false);
	const isClicked = ref(false);
	const radioSelected = ref<"foo" | "bar">("foo");
	
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
			<RadioButton v-model="radioSelected" value="foo">单选框</RadioButton>
			<RadioButton v-model="radioSelected" value="bar">单选框</RadioButton>
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

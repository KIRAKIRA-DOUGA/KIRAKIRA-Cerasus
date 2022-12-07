<script setup lang="ts">
	const page = ref(1);
	const toggle = ref(false);
	const isClicked = ref(false);
	const radioSelected = ref("");

	async function onClickButton() {
		isClicked.value = true;
		await delay(2000);
		isClicked.value = false;
	}

	useHead({ title: "首页" });
</script>

<template>
	<div class="kirakiraHomePageBox">
		<div>
			kirakira home
		</div>
		<NuxtLink to="/VideoPlay">
			video
		</NuxtLink>
		<div class="componentTest">
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
	.kirakiraHomePageBox {

		/* please romove when deploy  下方CSS请在部署前移除 */
		background-color: rgba(0, 30, 255, 0.05);
	}

	.componentTest {
		padding: 1rem;

		> * {
			margin: 0.25rem 0.5rem;
		}
	}
</style>

<script setup lang="ts">
	const page = ref(1);
	const toggle = ref(false);
	const isClicked = ref(false);

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
			<RadioButton>单选框</RadioButton>
			<ProgressRing />
			<LogoCover />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.kirakiraHomePageBox {
		background-color: yellow;
	}

	.componentTest {
		padding: 1rem;

		> * {
			margin: 0.25rem 0.5rem;
		}
	}
</style>

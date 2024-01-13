<template>
	<Subheader icon="error" class="danger">
		这里的选项都是实验性且不保证稳定运行的，<s>甚至可能是开发组做着玩的，</s>请尝试使用的同时注意安全！<s>如由此遇到的设备损坏或人身伤害 KIRAKIRA 不承担任何责任。</s>
	</Subheader>
	<Subheader icon="palette">{{ t.appearance }}</Subheader>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().sharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().flatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
	</section>
</template>

<style scoped lang="scss">
	.danger :deep(*) {
		color: c(red);
		font-weight: 900;
	}
</style>

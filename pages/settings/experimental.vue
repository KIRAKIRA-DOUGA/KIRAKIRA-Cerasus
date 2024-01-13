<template>
	<p>这里的选项都是实验性且不稳定的<s>，甚至可能是开发组做着玩的</s>，请尝试使用的同时注意安全！(⊙ω⊙)</p>
	<section list>
		<ToggleSwitch v-model="useAppSettingsStore().showCssDoodle" v-ripple icon="wallpaper">{{ t.background.animated }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().sharpAppearanceMode" v-ripple icon="square">{{ t.appearance.sharp_mode }}</ToggleSwitch>
		<ToggleSwitch v-model="useAppSettingsStore().flatAppearanceMode" v-ripple icon="layers">{{ t.appearance.flat_mode }}</ToggleSwitch>
	</section>
</template>

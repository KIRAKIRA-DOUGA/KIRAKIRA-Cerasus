<script setup lang="ts">
	const theme = Theme.theme;
	const palette = Theme.palette;
	const themeList = ["light", "dark", "system"] as const;
	const paletteList = ["pink", "sky", "blue", "orange", "purple", "green"] as const;
</script>

<template>
	<Subheader icon="brightness_medium">{{ t.theme }}</Subheader>
	<div class="chip radio-group">
		<RadioButton
			v-for="item in themeList"
			:key="item"
			v-model="theme"
			v-ripple
			:value="item"
		>{{ t[item] }}</RadioButton>
	</div>
	<Subheader icon="palette">{{ t.palette }}</Subheader>
	<div class="chip radio-group">
		<RadioButton
			v-for="item in paletteList"
			:key="item"
			v-model="palette"
			v-ripple
			:value="item"
		>{{ t[item] }}</RadioButton>
	</div>
</template>

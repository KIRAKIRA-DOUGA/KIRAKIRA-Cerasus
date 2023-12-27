<script setup lang="ts">
	const horizontalFlip = defineModel<boolean>("horizontalFlip", { default: false });
	const verticalFlip = defineModel<boolean>("verticalFlip", { default: false });
</script>

<template>
	<Comp>
		<ShadingIcon icon="settings" position="right bottom" rotating elastic large />

		<p>画面</p>
		<ToggleSwitch v-model="horizontalFlip" v-ripple icon="flip_horizontal">水平翻转</ToggleSwitch>
		<ToggleSwitch v-model="verticalFlip" v-ripple icon="flip_vertical">垂直翻转</ToggleSwitch>

	</Comp>
</template>

<style scoped lang="scss">
	$padding: 16px;
	$icon-size: 24px;
	$gap: 16px;

	:comp {
		position: relative;
		flex-grow: 1;
		padding-top: 8px;
	}

	.shading-icon {
		position: absolute;
	}

	p {
		display: flex;
		align-items: center;
		height: 36px;
		padding-left: $padding + $icon-size + $gap;
		color: c(accent);
		font-weight: 600;
	}

	.toggle-switch {
		height: 48px;
		padding: 0 $padding;

		&:deep(.icon) {
			margin-right: $gap;
			font-size: $icon-size;
		}
	}
</style>
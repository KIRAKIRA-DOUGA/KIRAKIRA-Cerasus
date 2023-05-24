<docs>

</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 文件路径，注意带上格式 */
		name: string;
	}>(), {
	});
	const type = props.name.substring(props.name.lastIndexOf(".") + 1, props.name.length);
	const path = props.name.substring(0, props.name.lastIndexOf("."));
</script>

<template>
	<Icon v-if="type === 'svg'" :name="path" />
	<img v-if="type !== 'svg'" :src="props.name" />
</template>

<style scoped lang="scss">
	img {
		position: absolute;
		display: flex;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 5px;
	}
	// TODO CSS 艾拉老师，救！
</style>

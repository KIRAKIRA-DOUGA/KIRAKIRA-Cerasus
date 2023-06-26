<script setup lang="ts">
	const add = ref("");
</script>

<template>
	<Subheader icon="block">屏蔽</Subheader>
	<span>不想交流的人，他将禁止与你互动</span>
	<section>
		<SettingsChipItem icon="placeholder" details="添加日期：XXXX-XX-XX">被屏蔽的人</SettingsChipItem>
	</section>
	<Subheader icon="palette">隐藏</Subheader>
	<span>不想看到的人，他将会从你的视角消失（除非你进入他的个人空间）</span>
	<section>
		<SettingsChipItem icon="placeholder" details="添加日期：XXXX-XX-XX">被屏蔽的人</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="person" />
		<Button icon="add">添加</Button>
	</div>
</template>

<style scoped lang="scss">
	.add {
		display: flex;
		gap: 8px;

		.text-box {
			width: 200px;
		}
	}
</style>

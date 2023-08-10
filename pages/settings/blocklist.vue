<script setup lang="ts">
	const add = ref("");
	const remove = () => { };
</script>

<template>
	<Subheader icon="block">封禁</Subheader>
	<span>不想交流的人，他将禁止与你互动</span>
	<section>
		<SettingsChipItem icon="placeholder" details="添加日期：XXXX-XX-XX" trailingIcon="delete" @trailingIconClick="remove">被封禁的人</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="person" />
		<Button icon="add">添加</Button>
	</div>

	<Subheader icon="visibility_off">隐藏</Subheader>
	<span>不想看到的人，他将会从你的视角消失（除非你主动进入他的个人空间）</span>
	<section>
		<SettingsChipItem icon="placeholder" details="添加日期：XXXX-XX-XX" trailingIcon="delete" @trailingIconClick="remove">被隐藏的人</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="person" />
		<Button icon="add">添加</Button>
	</div>

	<Subheader icon="tag">标签</Subheader>
	<span>不想看到的稿件标签匹配</span>
	<section>
		<SettingsChipItem details="添加日期：XXXX-XX-XX" trailingIcon="delete" @trailingIconClick="remove">被隐藏的标签</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="tag" />
		<Button icon="add">添加</Button>
	</div>

	<Subheader icon="key">关键词</Subheader>
	<span>不想看到的稿件关键词匹配</span>
	<section>
		<SettingsChipItem details="添加日期：XXXX-XX-XX" trailingIcon="delete" @trailingIconClick="remove">被隐藏的关键词</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="key" />
		<Button icon="add">添加</Button>
	</div>

	<Subheader icon="regexp">正则表达式</Subheader>
	<span>不想看到的稿件关键词正则表达式匹配</span>
	<section>
		<SettingsChipItem details="添加日期：XXXX-XX-XX" trailingIcon="delete" @trailingIconClick="remove">被隐藏的正则表达式</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="regexp" />
		<Button icon="add">添加</Button>
	</div>
</template>

<style scoped lang="scss">
	span {
		color: c(icon-color);
	}

	.subheader {
		margin-top: 1rem;

		&:first-child {
			margin-top: 0;
		}
	}

	.add {
		display: flex;
		gap: 8px;

		.text-box {
			width: 100%;
		}

		button {
			flex-shrink: 0;
		}
	}
</style>

<script setup lang="ts">
	const add = ref("");
	const remove = () => { };
</script>

<template>
	<Subheader icon="block">{{ t.blocklist.ban }}</Subheader>
	<span>{{ t.blocklist.ban.description }}</span>
	<section>
		<SettingsChipItem icon="placeholder" :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">user</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="person" />
		<Button icon="add">{{ t.add }}</Button>
	</div>

	<Subheader icon="visibility_off">{{ t.blocklist.hide }}</Subheader>
	<span>{{ t.blocklist.hide.description }}</span>
	<section>
		<SettingsChipItem icon="placeholder" :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">user</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="person" />
		<Button icon="add">{{ t.add }}</Button>
	</div>

	<hr />

	<Subheader icon="tag">{{ t.tags }}</Subheader>
	<span>{{ t.blocklist.tags.description }}</span>
	<section>
		<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">tag</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="tag" />
		<Button icon="add">{{ t.add }}</Button>
	</div>

	<Subheader icon="key">{{ t.keywords }}</Subheader>
	<span>{{ t.blocklist.keywords.description }}</span>
	<section>
		<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">keyword</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="key" />
		<Button icon="add">{{ t.add }}</Button>
	</div>

	<Subheader icon="regexp">{{ t.regexp }}</Subheader>
	<span>{{ t.blocklist.regexp.description }}</span>
	<section>
		<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">regexp</SettingsChipItem>
	</section>
	<div class="add">
		<TextBox v-model="add" icon="regexp" />
		<Button icon="add">{{ t.add }}</Button>
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

	hr {
		margin-top: 1rem;
	}
</style>

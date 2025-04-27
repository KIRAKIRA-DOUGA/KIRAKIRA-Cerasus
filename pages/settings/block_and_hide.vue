<script setup lang="ts">
	const add = ref("");
	const remove = useNoop;
</script>

<template>
	<div>
		<InfoBar type="warning" :title="t.severity.warning">
			{{ t.under_construction.page }}
		</InfoBar>

		<Subheader icon="block">{{ t.block_and_hide.block }}</Subheader>
		<span>{{ t.block_and_hide.block.description }}</span>
		<section>
			<SettingsChipItem icon="placeholder" :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">user</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="add" icon="person" />
			<Button icon="add">{{ t.step.add }}</Button>
		</div>

		<Subheader icon="visibility_off">{{ t.block_and_hide.hide }}</Subheader>
		<span>{{ t.block_and_hide.hide.description }}</span>
		<section>
			<SettingsChipItem icon="placeholder" :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">user</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="add" icon="person" />
			<Button icon="add">{{ t.step.add }}</Button>
		</div>

		<hr />

		<Subheader icon="tag">{{ t(2).tag }}</Subheader>
		<span>{{ t.block_and_hide.tag.description }}</span>
		<section>
			<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">tag</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="add" icon="tag" />
			<Button icon="add">{{ t.step.add }}</Button>
		</div>

		<Subheader icon="key">{{ t(2).keyword }}</Subheader>
		<span>{{ t.block_and_hide.keyword.description }}</span>
		<section>
			<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">keyword</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="add" icon="key" />
			<Button icon="add">{{ t.step.add }}</Button>
		</div>

		<Subheader icon="regexp">{{ t.regexp }}</Subheader>
		<span>{{ t.block_and_hide.regexp.description }}</span>
		<section>
			<SettingsChipItem :details="t.addition_date + t.colon" trailingIcon="delete" @trailingIconClick="remove">regexp</SettingsChipItem>
		</section>
		<div class="add">
			<TextBox v-model="add" icon="regexp" />
			<Button icon="add">{{ t.step.add }}</Button>
		</div>
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

<script setup lang="ts">
	const nickname = ref("");
	const nicknameEdit = computed({
		get: () => nickname.value,
		set: async value => {
			nickname.value = value;
			await nextTick();
			value = value.replaceAll(/[^A-Za-z0-9-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿\u{20000}-\u{2f799}\u{30000}-\u{323af}]/gu, "");
			nickname.value = value.slice(0, 20);
		},
	});
	const gender = ref("");
	const genderList = ["male", "female", "transgender"] as const;
	const birthday = ref("");
</script>

<template>
	<div class="nickname">
		<TextBox v-model="nicknameEdit" :placeholder="t.nickname" size="large" icon="person" />
		<span>{{ t.nicknameRequirements }}</span>
	</div>

	<TextBox v-model="birthday" :placeholder="t.birthday" size="large" icon="birthday" />
	<!-- TODO: 日期选择组件 -->

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="gender" class="icon" />
			<span class="text">{{ t.psychologicalGender }}</span>
		</div>

		<div class="gender-radio-group">

			<RadioButton
				v-for="item in genderList"
				:key="item"
				v-model="gender"
				:value="item"
			>{{ t[item] }}</RadioButton>
		</div>
	</div>

	<div class="submit">
		<Button icon="check">{{ t.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.nickname {
		@include flex-block;
		gap: 8px;

		span {
			color: c(icon-color);
			font-size: 12px;
			text-align: right;
		}
	}

	.gender {
		display: flex;
		flex-wrap: wrap;
		row-gap: 1em;
		align-items: center;
		padding: 0 12px;
		color: c(icon-color);

		.icon {
			font-size: 24px;
		}

		.text {
			flex-shrink: 0;
			margin-right: 32px;
			margin-left: 16px;
		}

		.gender-subtitle {
			display: flex;
			align-items: center;
		}

		.gender-radio-group {
			display: flex;
			gap: 32px;
		}
	}

	.submit {
		display: flex;
		justify-content: flex-end;
	}
</style>

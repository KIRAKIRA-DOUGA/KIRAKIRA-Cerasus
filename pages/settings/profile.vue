<script setup lang="ts">
	const nickname = ref("");
	const nicknameEdit = computed({
		get: () => nickname.value,
		set: async value => {
			nickname.value = value;
			await nextTick();
			value = value.replaceAll(/[^A-Za-z0-9-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿𠀀-𮹊𰀀-𲎯]/gu, "");
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
		<span>{{ t.nickname_requirements }}</span>
	</div>

	<TextBox v-model="birthday" :placeholder="t.birthday" size="large" icon="birthday" />
	<!-- TODO: 日期选择组件 -->

	<div class="gender">
		<Icon name="gender" class="icon" />
		<div class="gender-radio-group">
			<span class="text">{{ t.gender }}</span>
			<RadioButton
				v-for="item in genderList"
				:key="item"
				v-model="gender"
				:value="item"
			>{{ t[item] }}</RadioButton>
		</div>
	</div>
	<!-- TODO: 手机访问时由于宽度过窄，导致性别一栏布局异常。 -->

	<div class="submit">
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.save }}</Button>
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
		align-items: center;
		padding: 0 12px;
		color: c(icon-color);

		.icon {
			font-size: 24px;
		}

		.gender-radio-group {
			display: flex;
			gap: 32px;
			align-items: center;

			.text {
				margin-left: 16px;
			}
		}
	}

	.submit {
		display: flex;
		justify-content: flex-end;
	}
</style>

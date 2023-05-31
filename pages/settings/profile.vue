<script setup lang="ts">
	const nickname = ref("");
	const gender = ref("");
	const genderList = ["male", "female", "middle"] as const;
	const birthday = ref("");
</script>

<template>
	<div class="nickname">
		<TextBox v-model="nickname" :placeholder="t.nickname" size="large" icon="person" /> <!--  TODO: 判断昵称格式 -->
		<span>{{ t.nicknameRequirements }}</span>
	</div>

	<div class="gender">
		<Icon name="gender" class="icon" />
		<div class="gender-radio-group">
			<span class="text">{{ t.psychologicalGender }}</span>
			<RadioButton
				v-for="item in genderList"
				:key="item"
				v-model="gender"
				:value="item"
			>{{ t[item] }}</RadioButton>
		</div>
	</div>

	<TextBox v-model="birthday" :placeholder="t.birthday" size="large" icon="birthday" /> <!--  TODO: 日期选择组件 -->

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

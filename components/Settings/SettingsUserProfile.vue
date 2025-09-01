<docs>
	将用户个人信息编辑封装到一个单独组件。
</docs>

<script setup lang="ts">
	import makeUsername from "pomsky/username.pom";

	// const test = ref("");
	const validChar = makeUsername();
	const profile = defineModel<{
		name: string;
		nickname: string;
		nameValid?: boolean;
		bio: string;
		gender: string;
		birthday: Temporal.PlainDate;
		tags: string[];
	}>({ required: true });
	const nameTextBox = ref<InstanceType<typeof TextBox>>();
	watch(() => profile.value.name, () => {
		profile.value.nameValid = nameTextBox.value?.isInvalid() === false; // 在值为 true 和 undefined 的情况下返回 false。
	}, { immediate: true });
</script>

<template>
	<div class="name">
		<TextBox
			ref="nameTextBox"
			v-model="profile.name"
			:placeholder="t.user.username"
			size="large"
			icon="person"
			required
			:pattern="validChar"
			:maxLength="20"
		/>
		<span>{{ t.user.username_requirements }}</span>
	</div>

	<div class="nickname">
		<TextBox
			ref="nameTextBox"
			v-model="profile.nickname"
			:placeholder="t.user.nickname"
			size="large"
			icon="person"
			:pattern="validChar"
			:maxLength="20"
		/>
		<span>{{ t.user.nickname_requirements }}</span>
	</div>

	<!-- <TextBox
		v-model="test"
		inputMode="numeric"
		placeholder="测试：只能输入0到99之间的整数"
		icon="placeholder"
		required
		:min="0"
		:max="99"
		:step="1"
	/> -->

	<TextBox v-model="profile.bio" :placeholder="t.user.bio" icon="edit" />

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="birthday" class="icon" />
			<span class="text">{{ t.user.birthday }}</span>
		</div>

		<DatePicker v-model="profile.birthday" />
	</div>

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="gender" class="icon" />
			<span class="text">{{ t.user.gender }}</span>
		</div>

		<div class="gender-radio-group">
			<RadioButton v-model="profile.gender" value="male">{{ t.user.male }}</RadioButton>
			<RadioButton v-model="profile.gender" value="female">{{ t.user.female }}</RadioButton>
			<RadioButton v-model="profile.gender" value="other">{{ t.other }}</RadioButton>
		</div>
	</div>

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="tag" class="icon" />
			<span class="text">{{ t(profile.tags.length).tag }}</span>
		</div>
		<!-- TODO: 需要改成和投稿页面一致的 TAG 创建逻辑 -->
		<TagsEditor v-model="profile.tags" />
	</div>
</template>

<style scoped lang="scss">
	.text-box:not(.normal) {
		--size: large;
	}

	.name,
	.nickname {
		display: flex;
		flex-direction: column;
		gap: 8px;

		span {
			color: c(icon-color);
			font-size: 12px;
			text-align: right;
		}
	}

	.gender {
		display: flex;
		row-gap: 1rem;
		align-items: center;
		min-height: 36px;
		padding: 0 12px;
		color: c(icon-color);

		&,
		* {
			flex-wrap: wrap;
		}

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
			gap: 1rem 32px;
		}

		.text-box {
			width: 200px;

			&.v-enter-from,
			&.v-leave-to {
				width: 0;
			}
		}
	}
</style>

<docs>
	将用户个人信息编辑封装到一个单独组件。
</docs>

<script setup lang="ts">
	import makeUsername from "pomsky/username.pom";

	// const test = ref("");
	const validChar = makeUsername();
	const profile = defineModel<{
		name: string;
		nameValid?: boolean;
		bio: string;
		gender: string;
		birthday: Date;
		tags: string[];
	}>({ required: true });
	const genderCustomChecked = ref(false);
	const isBasicGender = (gender: string): gender is "male" | "female" | "" => gender === "male" || gender === "female" || gender === "" && !genderCustomChecked.value;
	const genderCustomBackup = ref(isBasicGender(profile.value.gender) ? "" : profile.value.gender);
	const genderBasic = computed({
		get: () => {
			const { gender } = profile.value;
			return !isBasicGender(gender) ? "custom" : gender;
		},
		set: value => {
			if (value === "custom") {
				genderCustomChecked.value = true;
				profile.value.gender = genderCustomBackup.value;
			} else profile.value.gender = value;
		},
	});
	const genderCustom = computed({
		get: () => {
			const { gender } = profile.value;
			return !isBasicGender(gender) ? gender : "";
		},
		set: value => {
			genderCustomBackup.value = value;
			profile.value.gender = value;
		},
	});
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
			:placeholder="t.user.name"
			size="large"
			icon="person"
			required
			:pattern="validChar"
			:maxLength="20"
		/>
		<span>{{ t.user.name_requirements }}</span>
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

	<!-- <TextBox v-model="profile.birthday" type="date" :placeholder="t.user.birthday" icon="birthday" /> -->
	<!-- TODO: [艾拉] 这里需要日期选择组件，谁来做一下？ -->
	<!-- [琪露诺瓦露] 日期选择点击X按钮，再次选择日期后按钮不会出现。 -->
	<!-- [兰音] 由于日期组件尚未制作，目前仅是一个占位符，暂时不必在意其功能或外观等的问题。 -->

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="gender" class="icon" />
			<span class="text">{{ t.user.gender }}</span>
		</div>

		<div class="gender-radio-group">
			<RadioButton v-model="genderBasic" value="male">{{ t.user.male }}</RadioButton>
			<RadioButton v-model="genderBasic" value="female">{{ t.user.female }}</RadioButton>
			<div class="gender-custom">
				<RadioButton v-model="genderBasic" value="custom">{{ t.custom }}</RadioButton>
				<Transition>
					<TextBox v-show="genderBasic === 'custom'" v-model="genderCustom" class="normal" />
				</Transition>
			</div>
		</div>
	</div>
	
	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="tag" class="icon" />
			<span class="text">{{ t(profile.tags.length).tag }}</span>
		</div>
		<TagsEditor v-model="profile.tags" />
	</div>
</template>

<style scoped lang="scss">
	.text-box:not(.normal) {
		--size: large;
	}
	
	.name {
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
		align-items: center;
		min-height: 36px;
		padding: 0 12px;
		color: c(icon-color);
		row-gap: 1rem;

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

		.gender-custom {
			display: flex;
			gap: 1rem;
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

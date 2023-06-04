<script setup lang="ts">
	import avatar from "assets/images/aira.jpg";

	const nickname = ref("艾了个拉");
	const nicknameEdit = computed({
		get: () => nickname.value,
		set: async value => {
			nickname.value = value;
			await nextTick();
			value = value.replaceAll(/[^A-Za-z0-9-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿𠀀-𮹊𰀀-𲎯]/gu, "");
			nickname.value = value.slice(0, 20);
		},
	});
	const signature = ref("");
	const genderBasic = ref<"male" | "female" | "custom" | "">("");
	const genderCustom = ref("");
	const birthday = ref("");
</script>

<template>
	<div class="change-avatar">
		<div v-ripple class="avatar">
			<img :src="avatar" alt="avatar" draggable="false" />
		</div>
		<span>点击更换头像</span>
	</div>

	<div class="nickname">
		<TextBox v-model="nicknameEdit" :placeholder="t.nickname" size="large" icon="person" />
		<span>{{ t.nickname_requirements }}</span>
	</div>

	<TextBox v-model="signature" placeholder="个性签名" size="large" icon="placeholder" />

	<TextBox v-model="birthday" :placeholder="t.birthday" size="large" icon="birthday" />
	<!-- TODO: 日期选择组件 -->

	<div class="gender">
		<div class="gender-subtitle">
			<Icon name="gender" class="icon" />
			<span class="text">{{ t.gender }}</span>
		</div>

		<div class="gender-radio-group">
			<RadioButton v-model="genderBasic" value="male">{{ t.male }}</RadioButton>
			<RadioButton v-model="genderBasic" value="female">{{ t.female }}</RadioButton>
			<div class="gender-custom">
				<RadioButton v-model="genderBasic" value="custom">{{ t.custom }}</RadioButton>
				<Transition>
					<TextBox v-show="genderBasic === 'custom'" v-model="genderCustom" />
				</Transition>
			</div>
		</div>
	</div>

	<div class="submit">
		<Button icon="reset" secondary>{{ t.reset }}</Button>
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.change-avatar {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		color: c(icon-color);

		.avatar {
			@include square(64px);
			@include circle;
			overflow: hidden;
			background-color: c(gray-30);

			> img {
				z-index: 1;
				width: 100%;
				object-fit: cover;
				cursor: pointer;
				aspect-ratio: 1 / 1;

				@media (any-hover: hover) {
					&:hover {
						scale: 125%;
					}

					&:not(:hover) {
						transition-duration: 1s;
					}
				}
			}
		}
	}

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

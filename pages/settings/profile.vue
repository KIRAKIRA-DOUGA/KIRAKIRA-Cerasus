<script setup lang="ts">
	import banner from "assets/images/banner-20220717.png";

	const avatar = "/static/images/avatars/aira.webp";
	const validChar = /[A-Za-z0-9\-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿𠀀-𮹊𰀀-𲎯]*/u;
	const name = ref("艾了个拉");
	// const test = ref("");
	const signature = ref("");
	const genderBasic = ref<"male" | "female" | "unknown" | "custom" | "">("");
	const genderCustom = ref("");
	const birthday = ref(formatDate(new Date(), "yyyy/MM/dd"));
</script>

<template>
	<div v-ripple class="banner">
		<img :src="banner" alt="banner" draggable="false" />
		<span>{{ t.settings.profile.edit_banner }}</span>
	</div>

	<div class="change-avatar">
		<UserAvatar :avatar="avatar" />
		<span>{{ t.settings.profile.edit_avatar }}</span>
	</div>

	<div class="items">
		<div class="name">
			<TextBox
				v-model="name"
				:placeholder="t.user.name"
				size="large"
				icon="person"
				required
				preventIfInvalid
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

		<TextBox v-model="signature" :placeholder="t.user.bio" icon="edit" />

		<TextBox v-model="birthday" type="date" :placeholder="t.birthday" icon="birthday" />
		<!-- TODO: [艾拉] 这里需要日期选择组件，谁来做一下？ -->
		<!-- [琪露诺瓦露] 日期选择点击X按钮，再次选择日期后按钮不会出现。 -->
		<!-- [兰音] 由于日期组件尚未制作，目前仅是一个占位符，暂时不必在意其功能或外观等的问题。 -->

		<div class="gender">
			<div class="gender-subtitle">
				<Icon name="gender" class="icon" />
				<span class="text">{{ t.user.gender }}</span>
			</div>

			<div class="gender-radio-group">
				<RadioButton v-model="genderBasic" value="male">{{ t.male }}</RadioButton>
				<RadioButton v-model="genderBasic" value="female">{{ t.female }}</RadioButton>
				<RadioButton v-model="genderBasic" value="unknown">{{ t.unknown }}</RadioButton>
				<div class="gender-custom">
					<RadioButton v-model="genderBasic" value="custom">{{ t.custom }}</RadioButton>
					<Transition>
						<TextBox v-show="genderBasic === 'custom'" v-model="genderCustom" class="normal" />
					</Transition>
				</div>
			</div>
		</div>
	</div>

	<div class="submit">
		<Button icon="reset" class="secondary">{{ t.reset }}</Button>
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		@include round-large;
		position: relative;
		overflow: hidden;
		background-color: c(gray-5);

		> img {
			z-index: 1;
			width: 100%;
			height: 150px;
			object-fit: cover;
			cursor: pointer;

			&:any-hover {
				filter: brightness(0.75) blur(2px);
				scale: 105%;

				& + span {
					opacity: 1;
				}
			}

			&:not(:any-hover) {
				transition-duration: 1s;
			}
		}

		span {
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 5;
			margin: 1rem;
			color: white;
			opacity: 0;
			pointer-events: none;
		}
	}

	.change-avatar {
		z-index: 5;
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		margin: -48px 0 12px 24px;
		color: c(icon-color);
		pointer-events: none;

		.user-avatar {
			--size: 64px;
			pointer-events: auto;

			&:any-hover + span {
				opacity: 1;
			}
		}

		span {
			margin-bottom: 0.5rem;
			opacity: 0;
			pointer-events: none;
		}
	}

	.items {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.text-box:not(.normal) {
			--size: large;
		}
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

<script setup lang="ts">
	import avatar from "assets/images/aira.webp";
	import banner from "assets/images/banner-20220717.png";

	const validChar = /[A-Za-z0-9\-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿𠀀-𮹊𰀀-𲎯]*/u;
	const nickname = ref("艾了个拉");
	const test = ref("");
	const signature = ref("");
	const genderBasic = ref<"male" | "female" | "custom" | "">("");
	const genderCustom = ref("");
	const birthday = ref(formatDate(new Date(), "yyyy-MM-dd"));
</script>

<template>
	<div v-ripple class="banner">
		<img :src="banner" alt="banner" draggable="false" />
		<span>点击更换封面</span>
	</div>

	<div class="change-avatar">
		<div v-ripple class="avatar">
			<img :src="avatar" alt="avatar" draggable="false" />
		</div>
		<span>点击更换头像</span>
	</div>

	<div class="items">
		<div class="nickname">
			<TextBox
				v-model="nickname"
				:placeholder="t.nickname"
				size="large"
				icon="person"
				required
				preventIfInvalid
				:pattern="validChar"
				:maxLength="20"
			/>
			<span>{{ t.nickname_requirements }}</span>
		</div>

		<TextBox
			v-model="test"
			inputMode="numeric"
			placeholder="测试：只能输入0到99之间的整数"
			icon="placeholder"
			required
			:min="0"
			:max="99"
			:step="1"
		/>

		<TextBox v-model="signature" placeholder="个性签名" icon="edit" />

		<TextBox v-model="birthday" type="date" :placeholder="t.birthday" icon="birthday" />
		<!-- TODO: [艾拉] 日期选择组件 -->
		<!-- [琪露诺] 日期选择点击X按钮，再次选择日期后按钮不会出现。 -->
		<!-- [兰音] 由于日期组件尚未制作，目前仅是一个占位符，暂时不必在意其功能或外观等的问题。 -->

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
	</div>

	<div class="submit">
		<Button icon="reset" secondary>{{ t.reset }}</Button>
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		@include radius-large;
		position: relative;
		overflow: hidden;
		background-color: c(gray-20);

		> img {
			z-index: 1;
			width: 100%;
			height: 150px;
			object-fit: cover;
			cursor: pointer;

			@media (any-hover: hover) {
				&:hover {
					filter: brightness(0.75) blur(2px);
					scale: 1.05;

					& + span {
						opacity: 1;
					}
				}

				&:not(:hover) {
					transition-duration: 1s;
				}
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

		.avatar {
			@include square(64px);
			@include circle;
			overflow: hidden;
			background-color: c(gray-30);
			pointer-events: auto;

			> img {
				z-index: 1;
				width: 100%;
				object-fit: cover;
				cursor: pointer;
				aspect-ratio: 1 / 1;

				@media (any-hover: hover) {
					&:hover {
						scale: 125%;
						filter: brightness(0.85);
					}

					&:not(:hover) {
						transition-duration: 1s;
					}
				}
			}

			@media (any-hover: hover) {
				&:hover + span {
					opacity: 1;
				}
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

		> .text-box {
			--size: large;
		}
	}

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

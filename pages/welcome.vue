<docs>
	首次登录且没有昵称时显示的页面。
</docs>

<script setup lang="ts">
	useHead({ title: "欢迎加入KIRAKIRA☆DOUGA大家庭" });

	const validChar = /[A-Za-z0-9\-_ぁ-ゖァ-ヺー〇一-鿿㐀-䶿𠀀-𮹊𰀀-𲎯]*/u;
	const name = ref("");
	const isRead = ref(false);
</script>

<template>
	<div class="banner">
		<LogoCover noAnimation noTitle />
		<h1>欢迎加入<LogoText />大家庭</h1>
	</div>
	<div class="container">
		<div class="card">
			<div class="card-rectangle"></div>
			<h2>完善个人信息</h2>
			<div class="items">
				<div class="avatar">
					<UserAvatar />
					<span>上传头像</span>
				</div>
				<div class="name">
					<TextBox
						v-model="name"
						:placeholder="t.user.name"
						size="large"
						icon="person"
						required
						:pattern="validChar"
						:maxLength="20"
					/>
					<span>{{ t.user.name_requirements }}</span>
				</div>
				<Checkbox v-model:single="isRead">我已阅读并同意<a href="https://otomad.github.io/cssc/license.htm" target="_blank">《KIRAKIRA☆DOUGA用户协议》</a></Checkbox>
				<Button icon="check" :disabled="!isRead" @click="navigate('/')">开始畅游KIRAKIRA☆DOUGA</Button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.banner {
		position: relative;

		.logo-cover {
			--width: 100%;
			--height: 280px;
			--full-logo: true;
			position: absolute;
			top: 0;
			mask-image: linear-gradient(white, transparent);
			pointer-events: none;
		}

		h1 {
			@include flex-center;
			flex-wrap: wrap;
			gap: 16px;
			width: 100%;
			padding: 30px 0;
			font-size: 48px;

			@include tablet {
				zoom: 0.6;
			}

			@include mobile {
				zoom: 0.4;
			}
		}

		.logo-text {
			--form: full;
			zoom: 2.5;
		}
	}

	h1,
	h2 {
		color: c(accent);
	}

	.container {
		padding-top: 0;
		padding-bottom: 0;

		h2 {
			font-size: 24px;
		}

		.card {
			position: relative;
			padding: 24px 32px;
			
			.card-rectangle {
				@include round-large(top);
				@include card-shadow-with-blur;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100lvh;
				background-color: c(white, 80%);
				
				~ * {
					position: relative;
				}
			}
			
			.items {
				display: flex;
				flex-direction: column;
				gap: 20px;
				align-items: stretch;
				margin-top: 24px;
				
				.text-box {
					--size: large;
				}
				
				.avatar {
					display: flex;
					gap: 16px;
					align-items: center;
					
					span {
						color: c(icon-color);
						font-size: 16px;
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
				
				button {
					margin-left: auto;
				}
			}
		}
	}
</style>

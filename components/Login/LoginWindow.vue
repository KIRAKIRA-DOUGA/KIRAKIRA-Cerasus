<script setup lang="ts">
	const loginEmail = ref("");
	const loginPassword = ref("");
</script>

<template>
	<kira-component class="login-window">
		<div class="main">
			<div class="title">
				<TitleMain>登录</TitleMain>
				<TitleSmall>Login</TitleSmall>
			</div>
			<div class="form">
				<TextBox v-model="loginEmail" type="email" placeholder="邮箱" size="large" icon="email" />
				<TextBox v-model="loginPassword" type="password" placeholder="密码" size="large" icon="lock" />
				<Button class="login-button">Link Start!</Button>
			</div>
			<div class="more-action">
				<Button class="flat">忘记密码</Button>
				<!-- TODO: button的:class不生效修复之后将这里的class="flat"改为flat -->
				<Button class="flat">注册新账号</Button>
			</div>
		</div>
		<div class="cover-wrapper">
			<LogoCover />
		</div>
	</kira-component>
</template>

<style scoped lang="scss">
	.login-window {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		width: 800px;
		height: 400px;
		overflow: hidden;
		background-color: c(inner-color-85, 50%);

		.main {
			@include flex-block;
			width: 400px;
			height: 100%;
			padding: 35px 45px;
		}
	}

	.form {
		@include flex-block;
		gap: 24px;

		.login-button {
			height: 44px;
			font-weight: 600;
			font-family: $english-logo-fonts;
			text-transform: uppercase;
		}
	}

	.title {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: flex-end;
		margin-bottom: 40px;
	}

	.cover-wrapper {
		@include card-in-card-shadow;
	}

	.more-action {
		display: flex;
		justify-content: space-between;
		margin-top: 26px;

		button.flat {
			&:nth-child(1) {
				margin-left: -16px;
			}

			&:nth-last-child(1) {
				margin-right: -16px;
			}
		}
	}
</style>

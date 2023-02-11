<script setup lang="ts">
	const loginEmail = ref("");
	const loginPassword = ref("");
</script>

<template>
	<div class="login-window">
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
		</div>
		<div class="cover-wrapper">
			<LogoCover />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.login-window {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		width: 800px;
		height: 400px;
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
</style>

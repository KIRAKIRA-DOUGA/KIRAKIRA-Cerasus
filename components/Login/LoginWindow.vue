<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});

	const email = ref("");
	const password = ref("");
</script>

<template>
	<Mask v-model="open" position="center" :zIndex="40">
		<Transition name="dialog">
			<kira-component v-if="open" class="login-window">
				<div class="main">
					<div class="title">
						<TitleMain>登录</TitleMain>
						<TitleSmall>Login</TitleSmall>
					</div>
					<div class="form">
						<TextBox v-model="email" type="email" placeholder="邮箱" size="large" icon="email" />
						<TextBox v-model="password" type="password" placeholder="密码" size="large" icon="lock" />
						<Button class="login-button">Link Start!</Button>
					</div>
					<div class="action">
						<Button secondary>忘记了密码</Button>
						<Button secondary>没有账号？注册</Button>
					</div>
				</div>
				<div class="cover-wrapper">
					<LogoCover />
				</div>
			</kira-component>
		</Transition>
	</Mask>
</template>

<style scoped lang="scss">
	.login-window {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		width: 800px;
		height: 400px;
		overflow: hidden;
		background-color: c(inner-color-85, 75%);
		transition-duration: 500ms;

		.main {
			@include flex-block;
			justify-content: space-between;
			width: 400px;
			height: 100%;
			padding: 35px 45px;
		}

		&.dialog-leave-active {
			transition-duration: 250ms;
		}

		&.dialog-enter-from,
		&.dialog-leave-to {
			opacity: 0;
			translate: 0 2rem;
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
	}

	.cover-wrapper {
		@include card-in-card-shadow;
	}

	.action {
		display: flex;
		justify-content: space-between;
		margin: 0 -16px;
	}
</style>

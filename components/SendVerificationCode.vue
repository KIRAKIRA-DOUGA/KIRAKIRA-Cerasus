<script setup lang="ts">
	const props = defineProps<{
		/** 邮箱地址。 */
		email?: string;
	}>();

	const emits = defineEmits<{
		send: [];
	}>();

	const value = defineModel<string>({ required: true });
	// const { timeout, isTimeouted, isResent, startTimeout } = useSendVerificationCodeTimeout(); // 垃圾 Pinia 不支持展开。
	const timeout = useSendVerificationCodeTimeout();
	const pattern = /^\d{6}$/;

	/**
	 * 发送验证码。
	 */
	async function sendVerificationCode() {
		emits("send");
		if (!props.email) return;
		const locale = getCurrentLocaleLangCode();
		const requestSendVerificationCodeRequest: RequestSendVerificationCodeRequestDto = {
			email: props.email,
			clientLanguage: locale,
		};
		const requestSendVerificationCodePromise = api.user.requestSendVerificationCode(requestSendVerificationCodeRequest);
		await requestSendVerificationCodePromise;
	}
</script>

<template>
	<TextBox v-model="value" required icon="verified" :placeholder="t.verification_code" :pattern autoComplete="one-time-code">
		<template #actions>
			<Button :disabled="!timeout.isTimeouted" @click="timeout.startTimeout(); sendVerificationCode();">
				{{ (timeout.isResent ? t.resend : t.send) + (timeout.isTimeouted ? "" : ` (${timeout.timeout})`) }}
			</Button>
		</template>
	</TextBox>
</template>

<style scoped lang="scss">
	@layer components {
		.text-box {
			--size: large;
		}
	}

	button {
		--appearance: secondary;
		font-variant-numeric: tabular-nums;
	}
</style>

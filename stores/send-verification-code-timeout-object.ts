export const useSendVerificationCodeTimeoutStoreObject = defineStore("use-send-verification-code-timeout-store-object", () => {
	type SendVerificationCodeTimeoutStore = ReturnType<ReturnType<typeof createSendVerificationCodeTimeoutStore>>;
	const timeouts = ref<Record<string, SendVerificationCodeTimeoutStore>>({});

	/**
	 * 启动倒计时。
	 * @param key - 键名
	 */
	function startTimeoutByKey(key: string) {
		if (key in timeouts)
			timeouts.value[key].startTimeout();
		else {
			const useSendVerificationCodeTimeout = createSendVerificationCodeTimeoutStore(key);
			const newTimeout = useSendVerificationCodeTimeout();
			newTimeout.startTimeout();
			timeouts.value[key] = newTimeout;
		}
	}

	return { timeouts, startTimeoutByKey };
});

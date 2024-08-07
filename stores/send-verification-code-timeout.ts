const TIMEOUT = 60;

export const useSendVerificationCodeTimeout = defineStore("send-verification-code-timeout", () => {
	const timeout = ref(0);
	const intervalId = ref<Timeout>();
	const isTimeouted = computed(() => timeout.value <= 0);
	const sendTimes = ref(0);
	const isResent = computed(() => sendTimes.value !== 0);

	/**
	 * 启动倒计时。
	 */
	function startTimeout() {
		if (!isTimeouted.value) return;
		sendTimes.value++;
		timeout.value = TIMEOUT;
		intervalId.value = setInterval(() => {
			timeout.value--;
			if (isTimeouted.value)
				clearInterval(intervalId.value);
		}, 1000);
	}

	return { timeout, isTimeouted, isResent, startTimeout };
});

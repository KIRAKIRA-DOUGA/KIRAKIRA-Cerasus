export const useUserInfoStore = defineStore("user-info", () => {
	/** 是否已经登录 */
	const isLogined = ref(false);
	/** 用户名 */
	const username = ref<string>("");

	return { isLogined, username };
});

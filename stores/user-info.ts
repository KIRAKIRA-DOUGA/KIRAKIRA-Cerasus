export const useSelfUserInfoStore = defineStore("user-info", () => {
	/** 是否已经登录？ */
	const isLogined = ref(false);
	/** 当前登录的用户的 UID */
	const uid = ref<number>();
	/** 当前登录的用户用户名。 */
	const username = ref("");
	/** 当前登录的用户的头像 */
	const userAvatar = ref("");
	/** 当前登录的用户的性别 */
	const gender = ref("");
	/** 当前登录的用户的个性签名或简介 */
	const signature = ref("");
	/** 当前登录的用户的生日 */
	const birthday = ref(0);
	/** 当前登录的用户的标签 */
	const tags = ref<UserLabelSchema[]>([]);

	/** 已登录用户是否允许在多设备上同步主题设置 */
	const isAllowSyncThemeSettings = ref(false);

	return { isLogined, uid, username, userAvatar, gender, signature, birthday, tags, isAllowSyncThemeSettings };
});

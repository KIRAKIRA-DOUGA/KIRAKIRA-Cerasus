export const useSelfUserInfoStore = defineStore("user-info", {
	state: () => ({
		/** 是否已经登录？ */
		isLogined: false,
		/** 当前登录的用户的 UID */
		uid: undefined as undefined | number,
		/** 用户的邮箱 */
		userEmail: undefined as undefined | string,
		/** 当前用户的注册时间 */
		userCreateDateTime: 0,
		/** 当前用户的角色 */
		role: "user",
		/** 当前登录的用户用户名。 */
		username: "",
		/** 当前登录的用户昵称 */
		userNickname: "",
		/** 当前登录的用户的头像 */
		userAvatar: "",
		/** 当前登录的用户的性别 */
		gender: "",
		/** 当前登录的用户的个性签名或简介 */
		signature: "",
		/** 当前登录的用户的生日 */
		birthday: 0,
		/** 当前登录的用户的标签 */
		tags: [] as string[],
		/** 暂时从侧栏中隐藏头像？ */
		tempHideAvatarFromSidebar: false,
	}),
});

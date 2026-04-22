import type { GetSelfUserInfoByUuidResponseDto } from "composables/api/User/UserControllerDto";

export const useSelfUserInfoStore = defineStore("user-info", {
	state: () => ({
		/**
		 * 是否已经获取了用户初始化引导数据？（通过 getUserBootstrapDataByHint 接口成功获取数据）
		 */
		isBootstrapDataReady: false,
		/** 是否已经登录？ */
		isLoggedIn: false,
		/** 用户信息 */
		userInfo: { } as Exclude<GetSelfUserInfoByUuidResponseDto["result"], undefined>,
		/** 暂时从侧栏中隐藏头像？ */
		tempHideAvatarFromSidebar: false,
	}),
});

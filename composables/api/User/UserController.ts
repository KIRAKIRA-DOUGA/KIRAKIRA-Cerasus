import { GET, POST, uploadFile2R2 } from "api/Common";
import getCorrectUri from "api/Common/getCorrectUri";
import { CUSTOMER_THEME_COLOR, DEFAULT_THEME_COLOR, SYSTEM_THEME } from "~/modules/theme/cookieBinding";
import { PALETTE_LIST } from "~/modules/theme/types";
import type { CheckUserTokenResponseDto, GetSelfUserInfoRequestDto, GetSelfUserInfoResponseDto, GetUserAvatarUploadSignedUrlResultDto, GetUserInfoByUidRequestDto, GetUserInfoByUidResponseDto, GetUserSettingsRequestDto, GetUserSettingsResponseDto, UpdateOrCreateUserSettingsRequestDto, UpdateOrCreateUserSettingsResponseDto, UpdateUserEmailRequestDto, UserExistsCheckRequestDto, UserExistsCheckResponseDto, UserLoginRequestDto, UserLoginResponseDto, UserRegistrationRequestDto, UserRegistrationResponseDto } from "./UserControllerDto";

const BACK_END_URL = getCorrectUri();
const USER_API_URI = `${BACK_END_URL}/user`;

/**
 * 用户注册
 * @param userRegistrationData 用户注册提交的参数
 * @returns 用户注册的返回参数
 */
export const registration = async (userRegistrationData: UserRegistrationRequestDto): Promise<UserRegistrationResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URI}/registering`, userRegistrationData, { credentials: "include" }) as UserRegistrationResponseDto;
};

/**
 * 用户登录
 * @param userLoginRequest 用户登录提交的参数
 * @returns 用户登录的返回参数
 */
export const login = async (userLoginRequest: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URI}/login`, userLoginRequest, { credentials: "include" }) as UserLoginResponseDto;
};

/**
 * 检查用户邮箱是否已经注册过
 * @param userExistsCheckRequest 验证用户邮箱是否存在提交的参数
 * @returns 验证用户邮箱是否已经存在的返回参数
 */
export const userExistsCheck = async (userExistsCheckRequest: UserExistsCheckRequestDto): Promise<UserExistsCheckResponseDto> => {
	return await GET(`${USER_API_URI}/existsCheck?email=${userExistsCheckRequest.email}`) as UserExistsCheckResponseDto;
};

/**
 * 用户更改邮箱
 * @param updateUserEmailRequest 用户更改邮箱的请求的参数
 * @returns 用户更改邮箱返回的参数
 */
export const updateUserEmail = async (updateUserEmailRequest: UpdateUserEmailRequestDto): Promise<UserLoginResponseDto> => {
	return await POST(`${USER_API_URI}/update/email`, updateUserEmailRequest) as UserLoginResponseDto;
};

/**
 * 获取当前登录的用户信息，前提是 token 中包含正确的 uid 和 token，同时丰富全局变量中的用户信息
 * @param getSelfUserInfoRequest 获取当前登录的用户信息的请求参数
 * @param pinia pinia
 * @returns 用户信息
 */
export const getSelfUserInfo = async (getSelfUserInfoRequest?: GetSelfUserInfoRequestDto): Promise<GetSelfUserInfoResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const selfUserInfo = await POST(`${USER_API_URI}/self`, getSelfUserInfoRequest, { credentials: "include" }) as GetSelfUserInfoResponseDto;
	if (selfUserInfo.success) {
		const selfUserInfoStore = useSelfUserInfoStore();
		selfUserInfoStore.isLogined = true;
		selfUserInfoStore.uid = selfUserInfo.result?.uid;
		selfUserInfoStore.userAvatar = selfUserInfo.result?.avatar || "";
		selfUserInfoStore.username = selfUserInfo.result?.username || "User"; // TODO: 使用多语言，为未设置用户名的用户提供国际化的缺省用户名
		selfUserInfoStore.gender = selfUserInfo.result?.gender || "";
		selfUserInfoStore.signature = selfUserInfo.result?.signature || "";
		selfUserInfoStore.tags = selfUserInfo.result?.label || [];
	}
	return selfUserInfo;
};

/**
 * 通过传入的 UID 获取一个用户的信息（已启用服务端渲染）
 * @param getUserInfoByUidRequest 传入的 UID
 */
export const getUserInfo = async (getUserInfoByUidRequest: GetUserInfoByUidRequestDto): Promise<GetUserInfoByUidResponseDto> => {
	const { data: result } = await useFetch(`${USER_API_URI}/info?uid=${getUserInfoByUidRequest.uid}`, { credentials: "include" }); // 使用 useFetch 以启用服务端渲染
	return result.value as GetUserInfoByUidResponseDto;
};

/**
 * 校验用户 token 是否合法，同时可以验证用户是否已经登录
 * @returns 用户信息
 */
export const checkUserToken = async (): Promise<CheckUserTokenResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${USER_API_URI}/check`, { credentials: "include" }) as CheckUserTokenResponseDto;
};

/**
 * 用户登出
 * @returns 什么也不返回，但是会携带立即清除的 cookie 并覆盖原本的 cookie，同时将全局变量中的用户信息置空
 */
export const userLogout = async (): Promise<undefined> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	await GET(`${USER_API_URI}/logout`, { credentials: "include" }) as undefined;
	const selfUserInfoStore = useSelfUserInfoStore();
	selfUserInfoStore.isLogined = false;
	selfUserInfoStore.uid = undefined;
	selfUserInfoStore.userAvatar = "";
	selfUserInfoStore.username = "";
	selfUserInfoStore.gender = "";
	selfUserInfoStore.signature = "";
	selfUserInfoStore.tags = [];
};

/**
 * 更新用户头像，并获取用于用户上传头像的预签名 URL, 上传限时 60 秒
 */
export const getUserAvatarUploadSignedUrl = async (): Promise<GetUserAvatarUploadSignedUrlResultDto> => {
	return await GET(`${USER_API_URI}/avatar/preUpload`, { credentials: "include" }) as GetUserAvatarUploadSignedUrlResultDto;
};

/**
 * 根据预签名 URL 上传用户头像
 * @param avatarBlobData 用 Blob 编码的用户头像文件
 * @param signedUrl 预签名 URL
 * @returns 是否上传成功，成功返回 true，失败返回 false
 */
export const uploadUserAvatar = async (avatarBlobData: Blob, signedUrl: string): Promise<boolean> => {
	try {
		await uploadFile2R2(signedUrl, avatarBlobData, "image/png", 60000);
		return true;
	} catch (error) {
		console.error("用户头像上传失败，错误信息：", error, { avatarBlobData, signedUrl });
		return false;
	}
};

/**
 * 获取用户设置，如果传入了 getUserSettingsRequest 且为提供 cookie（uid, token），则使用 getUserSettingsRequest 中的参数
 * @param getUserSettingsRequest 用户令牌
 * @returns 用户设置
 */
export const getUserSettings = async (getUserSettingsRequest?: GetUserSettingsRequestDto): Promise<GetUserSettingsResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const userSettings = await POST(`${USER_API_URI}/settings`, getUserSettingsRequest, { credentials: "include" }) as GetUserSettingsResponseDto;
	return userSettings;
};

/**
 * 更新用户设置
 * @param updateOrCreateUserSettingsRequest 更新的设置项
 * @returns 用户设置，同时更新的设置项会产生一个 set-cookie 的响应头
 */
export const updateUserSettings = async (updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto): Promise<UpdateOrCreateUserSettingsResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URI}/settings/update`, updateOrCreateUserSettingsRequest, { credentials: "include" }) as UpdateOrCreateUserSettingsResponseDto;
};

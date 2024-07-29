import { GET, POST, uploadFile2CloudflareImages } from "api/Common";
import getCorrectUri from "api/Common/getCorrectUri";
import type { CheckInvitationCodeRequestDto, CheckInvitationCodeResponseDto, CheckUserTokenResponseDto, CreateInvitationCodeResponseDto, GetMyInvitationCodeResponseDto, GetSelfUserInfoRequestDto, GetSelfUserInfoResponseDto, GetUserAvatarUploadSignedUrlResponseDto, GetUserInfoByUidRequestDto, GetUserInfoByUidResponseDto, GetUserSettingsRequestDto, GetUserSettingsResponseDto, RequestSendChangeEmailVerificationCodeRequestDto, RequestSendChangeEmailVerificationCodeResponseDto, RequestSendVerificationCodeRequestDto, RequestSendVerificationCodeResponseDto, UpdateOrCreateUserInfoResponseDto, UpdateOrCreateUserSettingsRequestDto, UpdateOrCreateUserSettingsResponseDto, UpdateUserEmailRequestDto, UpdateUserEmailResponseDto, UserExistsCheckRequestDto, UserExistsCheckResponseDto, UserLoginRequestDto, UserLoginResponseDto, UserRegistrationRequestDto, UserRegistrationResponseDto } from "./UserControllerDto";

const BACK_END_URL = getCorrectUri();
const USER_API_URL = `${BACK_END_URL}/user`;

/**
 * 用户注册
 * @param userRegistrationData 用户注册提交的参数
 * @returns 用户注册的返回参数
 */
export const registration = async (userRegistrationData: UserRegistrationRequestDto): Promise<UserRegistrationResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/registering`, userRegistrationData, { credentials: "include" }) as UserRegistrationResponseDto;
};

/**
 * 用户登录
 * @param userLoginRequest 用户登录提交的参数
 * @returns 用户登录的返回参数
 */
export const login = async (userLoginRequest: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/login`, userLoginRequest, { credentials: "include" }) as UserLoginResponseDto;
};

/**
 * 检查用户邮箱是否已经注册过
 * @param userExistsCheckRequest 验证用户邮箱是否存在提交的参数
 * @returns 验证用户邮箱是否已经存在的返回参数
 */
export const userExistsCheck = async (userExistsCheckRequest: UserExistsCheckRequestDto): Promise<UserExistsCheckResponseDto> => {
	return await GET(`${USER_API_URL}/existsCheck?email=${userExistsCheckRequest.email}`) as UserExistsCheckResponseDto;
};

/**
 * 用户更改邮箱
 * @param updateUserEmailRequest 用户更改邮箱的请求的请求载荷
 * @returns 用户更改邮箱返回的参数
 */
export const updateUserEmail = async (updateUserEmailRequest: UpdateUserEmailRequestDto): Promise<UpdateUserEmailResponseDto> => {
	return await POST(`${USER_API_URL}/update/email`, updateUserEmailRequest, { credentials: "include" }) as UpdateUserEmailResponseDto;
};

/**
 * 创建或更新用户信息
 * @param updateOrCreateUserInfoRequest 创建或更新用户信息的请求载荷
 * @returns 创建或更新用户信息的响应结果
 */
export const updateOrCreateUserInfo = async (updateOrCreateUserInfoRequest: UpdateOrCreateUserInfoRequestDto): Promise<UpdateOrCreateUserInfoResponseDto> => {
	return await POST(`${USER_API_URL}/update/info`, updateOrCreateUserInfoRequest, { credentials: "include" }) as UpdateOrCreateUserInfoResponseDto;
};

/**
 * 获取当前登录的用户信息，前提是 token 中包含正确的 uid 和 token，同时丰富全局变量中的用户信息
 * @param getSelfUserInfoRequest 获取当前登录的用户信息的请求参数
 * @param pinia pinia
 * @returns 用户信息
 */
export const getSelfUserInfo = async (getSelfUserInfoRequest?: GetSelfUserInfoRequestDto): Promise<GetSelfUserInfoResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const selfUserInfo = await POST(`${USER_API_URL}/self`, getSelfUserInfoRequest, { credentials: "include" }) as GetSelfUserInfoResponseDto;
	const selfUserInfoResult = selfUserInfo.result;
	if (selfUserInfo.success && selfUserInfoResult) {
		const selfUserInfoStore = useSelfUserInfoStore();
		selfUserInfoStore.isLogined = true;
		selfUserInfoStore.uid = selfUserInfoResult.uid;
		selfUserInfoStore.userCreateDateTime = selfUserInfoResult.userCreateDateTime ?? 0;
		selfUserInfoStore.userEmail = selfUserInfoResult.email ?? "";
		selfUserInfoStore.userAvatar = selfUserInfoResult.avatar || "";
		selfUserInfoStore.username = selfUserInfoResult.username || "Anonymous"; // TODO: 使用多语言，为未设置用户名的用户提供国际化的缺省用户名
		selfUserInfoStore.userNickname = selfUserInfoResult.userNickname || "Anonymous"; // TODO: 使用多语言，为未设置用户昵称的用户提供国际化的缺省用户昵称
		selfUserInfoStore.gender = selfUserInfoResult.gender || "";
		selfUserInfoStore.signature = selfUserInfoResult.signature || "";
		selfUserInfoStore.tags = selfUserInfoResult.label?.map(label => label.labelName) || [];
	}
	return selfUserInfo;
};

/**
 * 通过传入的 UID 获取一个用户的信息（已启用服务端渲染）
 * @param getUserInfoByUidRequest 传入的 UID
 */
export const getUserInfo = async (getUserInfoByUidRequest: GetUserInfoByUidRequestDto): Promise<GetUserInfoByUidResponseDto> => {
	const { data: result } = await useFetch(`${USER_API_URL}/info?uid=${getUserInfoByUidRequest.uid}`, { credentials: "include" }); // 使用 useFetch 以启用服务端渲染
	return result.value as GetUserInfoByUidResponseDto;
};

/**
 * 校验用户 token 是否合法，同时可以验证用户是否已经登录
 * @returns 用户信息
 */
export const checkUserToken = async (): Promise<CheckUserTokenResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${USER_API_URL}/check`, { credentials: "include" }) as CheckUserTokenResponseDto;
};

/**
 * 用户登出
 * @returns 什么也不返回，但是会携带立即清除的 cookie 并覆盖原本的 cookie，同时将全局变量中的用户信息置空
 */
export const userLogout = async (): Promise<undefined> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	await GET(`${USER_API_URL}/logout`, { credentials: "include" }) as undefined;
	const selfUserInfoStore = useSelfUserInfoStore();
	selfUserInfoStore.isLogined = false;
	selfUserInfoStore.uid = undefined;
	selfUserInfoStore.userCreateDateTime = 0;
	selfUserInfoStore.userEmail = "";
	selfUserInfoStore.userAvatar = "";
	selfUserInfoStore.username = "";
	selfUserInfoStore.userNickname = "";
	selfUserInfoStore.gender = "";
	selfUserInfoStore.signature = "";
	selfUserInfoStore.tags = [];
};

/**
 * 更新用户头像，并获取用于用户上传头像的预签名 URL, 上传限时 60 秒
 */
export const getUserAvatarUploadSignedUrl = async (): Promise<GetUserAvatarUploadSignedUrlResponseDto> => {
	return await GET(`${USER_API_URL}/avatar/preUpload`, { credentials: "include" }) as GetUserAvatarUploadSignedUrlResponseDto;
};

/**
 * 根据预签名 URL 上传用户头像
 * @param fileName 头像文件名
 * @param avatarBlobData 用 Blob 编码的用户头像文件
 * @param signedUrl 预签名 URL
 * @returns 是否上传成功，成功返回 true，失败返回 false
 */
export const uploadUserAvatar = async (fileName: string, avatarBlobData: Blob, signedUrl: string): Promise<boolean> => {
	try {
		await uploadFile2CloudflareImages(fileName, signedUrl, avatarBlobData, 60000);
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
	const userSettings = await POST(`${USER_API_URL}/settings`, getUserSettingsRequest, { credentials: "include" }) as GetUserSettingsResponseDto;
	return userSettings;
};

/**
 * 更新用户设置
 * @param updateOrCreateUserSettingsRequest 更新的设置项
 * @returns 用户设置，同时更新的设置项会产生一个 set-cookie 的响应头
 */
export const updateUserSettings = async (updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto): Promise<UpdateOrCreateUserSettingsResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/settings/update`, updateOrCreateUserSettingsRequest, { credentials: "include" }) as UpdateOrCreateUserSettingsResponseDto;
};

/**
 * 请求发送验证码
 * @param requestSendVerificationCodeRequest 请求发送验证码的请求载荷
 * @returns 请求发送验证码的请求响应
 */
export const requestSendVerificationCode = async (requestSendVerificationCodeRequest: RequestSendVerificationCodeRequestDto): Promise<RequestSendVerificationCodeResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/requestSendVerificationCode`, requestSendVerificationCodeRequest, { credentials: "include" }) as RequestSendVerificationCodeResponseDto;
};

/**
 * 检查一个邀请码是否可用
 * @param checkInvitationCodeRequestDto 检查一个邀请码是否可用的请求载荷
 * @returns 检查一个邀请码是否可用的请求响应
 */
export const checkInvitationCode = async (checkInvitationCodeRequestDto: CheckInvitationCodeRequestDto): Promise<CheckInvitationCodeResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/checkInvitationCode`, checkInvitationCodeRequestDto, { credentials: "include" }) as CheckInvitationCodeResponseDto;
};

/**
 * 生成邀请码
 * @returns 生成邀请码的请求响应
 */
export const createInvitationCode = async (): Promise<CreateInvitationCodeResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/createInvitationCode`, undefined, { credentials: "include" }) as CreateInvitationCodeResponseDto;
};

/**
 * 获取用户所有的邀请码
 * @param headerCookie 从客户端发起 SSR 请求时传递的 Header 中的 Cookie 部分，在 SSR 时将其转交给后端 API
 * @returns 用户所有的邀请码
 */
export const getMyInvitationCode = async (headerCookie: { cookie?: string | undefined }): Promise<GetMyInvitationCodeResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	// NOTE: use { headers: headerCookie } to passing client-side cookies to backend API when SSR.
	try {
		const { data: result } = await useFetch(`${USER_API_URL}/myInvitationCode`, { headers: headerCookie, credentials: "include" });
		return result.value as GetMyInvitationCodeResponseDto;
	} catch (error) {
		console.error("ERROR", "获取用户邀请码失败");
		return { success: false, message: "获取用户邀请码失败", invitationCodeResult: [] };
	}
};

/**
 * 请求发送修改邮箱的邮箱验证码
 * @param requestSendChangeEmailVerificationCodeRequest 请求发送修改邮箱的邮箱验证码的请求载荷
 * @returns 请求发送修改邮箱的邮箱验证码的请求响应
 */
export const requestSendChangeEmailVerificationCode = async (requestSendChangeEmailVerificationCodeRequest: RequestSendChangeEmailVerificationCodeRequestDto): Promise<RequestSendChangeEmailVerificationCodeResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${USER_API_URL}/requestSendChangeEmailVerificationCode`, requestSendChangeEmailVerificationCodeRequest, { credentials: "include" }) as RequestSendChangeEmailVerificationCodeResponseDto;
};

import { get, post } from "api/Common";
import getCorrectUri from "api/Common/getCorrectUri";
import type { CheckUserTokenResponseDto, GetUserInfoByUidResponseDto, UpdateUserEmailRequestDto, UserExistsCheckRequestDto, UserExistsCheckResponseDto, UserLoginRequestDto, UserLoginResponseDto, UserRegistrationRequestDto, UserRegistrationResponseDto } from "./UserControllerDto";

const BACK_END_URL = getCorrectUri();
const USER_API_URI = `${BACK_END_URL}/user`;

/**
 * 用户注册
 * @param userRegistrationData 用户注册提交的参数
 * @returns 用户注册的返回参数
 */
export const registration = async (userRegistrationData: UserRegistrationRequestDto): Promise<UserRegistrationResponseDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/registering`, userRegistrationData, { credentials: "include" }) as UserRegistrationResponseDto;
};

/**
 * 用户登录
 * @param userLoginRequest 用户登录提交的参数
 * @returns 用户登录的返回参数
 */
export const login = async (userLoginRequest: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/login`, userLoginRequest, { credentials: "include" }) as UserLoginResponseDto;
};

/**
 * 检查用户邮箱是否已经注册过
 * @param userExistsCheckRequest 验证用户邮箱是否存在提交的参数
 * @returns 验证用户邮箱是否已经存在的返回参数
 */
export const userExistsCheck = async (userExistsCheckRequest: UserExistsCheckRequestDto): Promise<UserExistsCheckResponseDto> => {
	return await get(`${USER_API_URI}/existsCheck?email=${userExistsCheckRequest.email}`) as UserExistsCheckResponseDto;
};

/**
 * 用户更改邮箱
 * @param updateUserEmailRequest 用户更改邮箱的请求的参数
 * @returns 用户更改邮箱返回的参数
 */
export const updateUserEmail = async (updateUserEmailRequest: UpdateUserEmailRequestDto): Promise<UserLoginResponseDto> => {
	return await post(`${USER_API_URI}/update/email`, updateUserEmailRequest) as UserLoginResponseDto;
};

/**
 * 获取用户信息，前提是 token 中包含正确的 uid 和 token
 * @returns 用户信息
 */
export const getUserInfo = async (): Promise<GetUserInfoByUidResponseDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await get(`${USER_API_URI}/info`, { credentials: "include" }) as GetUserInfoByUidResponseDto;
};

/**
 * 校验用户 token 是否合法，同时可以验证用户是否已经登录
 * @returns 用户信息
 */
export const checkUserToken = async (): Promise<CheckUserTokenResponseDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await get(`${USER_API_URI}/check`, { credentials: "include" }) as CheckUserTokenResponseDto;
};

/**
 * 用户登出
 * @returns 什么也不返回，但是会携带立即清除的 cookie 并覆盖圆本的 cookie
 */
export const userLogout = async (): Promise<undefined> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await get(`${USER_API_URI}/logout`, { credentials: "include" }) as undefined;
};

import { get, post } from "api/Common";
import getCorrectUri from "api/Common/getCorrectUri";
import type { UpdateUserEmailRequestDto, UserExistsCheckRequestDto, UserExistsCheckResponseDto, UserLoginRequestDto, UserLoginResponseDto, UserRegistrationRequestDto, UserRegistrationResponseDto } from "./UserControllerDto";

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
	return await get(`${USER_API_URI}/existsCheck?username=${userExistsCheckRequest.email}`) as UserExistsCheckResponseDto;
};

/**
 * 用户更改邮箱
 * @param updateUserEmailRequest 用户更改邮箱的请求的参数
 * @returns 用户更改邮箱返回的参数
 */
export const updateUserEmail = async (updateUserEmailRequest: UpdateUserEmailRequestDto): Promise<UserLoginResponseDto> => {
	return await post(`${USER_API_URI}/update/email`, updateUserEmailRequest) as UserLoginResponseDto;
};

import { get, post } from "../Common";
import type { UserExistsCheckDataDto, UserExistsCheckResultDto, UserLoginDataDto, UserLoginResultDto, UserRegistrationDataDto, UserRegistrationResultDto } from "./UserControllerDto";

const USER_API_URI = "https://localhost:9999/user";

export const registration = async (userRegistrationData: UserRegistrationDataDto): Promise<UserRegistrationResultDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/registering`, userRegistrationData, { credentials: "include" }) as UserRegistrationResultDto;
};

export const login = async (userLoginData: UserLoginDataDto): Promise<UserLoginResultDto> => {
	// TODO use { credentials: "include" } to allow save cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/login`, userLoginData, { credentials: "include" }) as UserLoginResultDto;
};

export const userExistsCheck = async (userExistsCheckData: UserExistsCheckDataDto): Promise<UserExistsCheckResultDto> => {
	return await get(`${USER_API_URI}/existsCheck?username=${userExistsCheckData.username}`) as UserExistsCheckResultDto;
};

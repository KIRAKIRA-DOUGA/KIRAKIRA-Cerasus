import { get, post } from "../Common";
import { UserExistsCheckDataDto, UserExistsCheckResultDto, UserLoginDataDto, UserLoginResultDto, UserRegistrationDataDto, UserRegistrationResultDto } from "./UserControllerDto";

const USER_API_URI = "http://localhost:9999/user";

export const registration = async (userRegistrationData: UserRegistrationDataDto): Promise<UserRegistrationResultDto> => {
	return await post(`${USER_API_URI}/registering`, userRegistrationData) as UserRegistrationResultDto;
};

export const login = async (userLoginData: UserLoginDataDto): Promise<UserLoginResultDto> => {
	return await post(`${USER_API_URI}/login`, userLoginData) as UserLoginResultDto;
};

export const userExistsCheck = async (userExistsCheckData: UserExistsCheckDataDto): Promise<UserExistsCheckResultDto> => {
	return await get(`${USER_API_URI}/existsCheck?username=${userExistsCheckData.username}`) as UserExistsCheckResultDto;
};

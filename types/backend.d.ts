import * as _user from "api/User/UserControllerDto";
import * as _video from "api/Video/VideoControllerDto";

/*
 * 此处声明与后端 API 相关的全局类型。
 */
declare global {
	export type { UserExistsCheckRequestDto, UserLoginRequestDto, UserRegistrationRequestDto } from "api/User/UserControllerDto";
	export type { ThumbVideoResponseDto, GetVideoByKvidRequestDto, GetVideoByKvidResponseDto } from "api/Video/VideoControllerDto";
}

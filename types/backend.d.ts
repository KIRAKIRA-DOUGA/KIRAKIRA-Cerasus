import * as _videoComment from "api/Comment/VideoCommentControllerDto";
import * as _danmaku from "api/Danmaku/DanmakuControllerDto";
import * as _user from "api/User/UserControllerDto";
import * as _video from "api/Video/VideoControllerDto";

/*
 * 此处声明与后端 API 相关的全局类型。
 */
declare global {
	export type { EmitVideoCommentDownvoteRequestDto, EmitVideoCommentRequestDto, EmitVideoCommentUpvoteRequestDto, GetVideoCommentByKvidRequestDto, GetVideoCommentByKvidResponseDto, VideoCommentResult } from "api/Comment/VideoCommentControllerDto";
	export type { EmitDanmakuRequestDto, GetDanmakuByKvidRequestDto } from "api/Danmaku/DanmakuControllerDto";
	export type { GetUserInfoByUidRequestDto, GetUserInfoByUidResponseDto, UserExistsCheckRequestDto, UserLabelSchema, UserLoginRequestDto, UserRegistrationRequestDto } from "api/User/UserControllerDto";
	export type { GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, ThumbVideoResponseDto } from "api/Video/VideoControllerDto";
}

import * as _videoComment from "api/Comment/VideoCommentControllerDto";
import * as _danmaku from "api/Danmaku/DanmakuControllerDto";
import * as _user from "api/User/UserControllerDto";
import * as _video from "api/Video/VideoControllerDto";
import * as _videoTag from "api/VideoTag/VideoTagControllerDto";

/*
 * 此处声明与后端 API 相关的全局类型。
 */
declare global {
	export type { CancelVideoCommentDownvoteRequestDto, CancelVideoCommentUpvoteRequestDto, EmitVideoCommentDownvoteRequestDto, EmitVideoCommentRequestDto, EmitVideoCommentUpvoteRequestDto, GetVideoCommentByKvidRequestDto, GetVideoCommentByKvidResponseDto, VideoCommentResult } from "api/Comment/VideoCommentControllerDto";
	export type { EmitDanmakuRequestDto, GetDanmakuByKvidRequestDto } from "api/Danmaku/DanmakuControllerDto";
	export type { UpdateOrCreateUserInfoRequestDto, GetSelfUserInfoRequestDto, GetUserInfoByUidRequestDto, GetUserInfoByUidResponseDto, GetUserSettingsRequestDto, GetUserSettingsResponseDto, UpdateOrCreateUserSettingsRequestDto, UserExistsCheckRequestDto, UserLabelSchema, UserLoginRequestDto, UserRegistrationRequestDto } from "api/User/UserControllerDto";
	export type { SearchVideoByVideoTagIdRequestDto, UploadVideoRequestDto, GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, SearchVideoByKeywordRequestDto, SearchVideoByKeywordResponseDto, ThumbVideoResponseDto } from "api/Video/VideoControllerDto";
	export type { GetVideoTagByTagIdRequestDto, CreateVideoTagRequestDto, VideoTag } from "api/VideoTag/VideoTagControllerDto";
}

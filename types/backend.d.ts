import * as _block from "api/BlockList/BlockControllerDto";
import * as _browsingHistory from "api/BrowsingHistory/BrowsingHistoryControllerDto";
import * as _videoComment from "api/Comment/VideoCommentControllerDto";
import * as _danmaku from "api/Danmaku/DanmakuControllerDto";
import * as _feed from "api/Feed/FeedControllerDto";
import * as _rbac from "api/Rbac/RbacControllerDto";
import * as _user from "api/User/UserControllerDto";
import * as _video from "api/Video/VideoControllerDto";
import * as _videoTag from "api/VideoTag/VideoTagControllerDto";

/*
 * 此处声明与后端 API 相关的全局类型。
 */
declare global {
	// BrowsingHistoryControllerDto
	export type { AdminDeleteVideoCommentRequestDto, DeleteSelfVideoCommentRequestDto, GetUserBrowsingHistoryWithFilterRequestDto, GetUserBrowsingHistoryWithFilterResponseDto } from "api/BrowsingHistory/BrowsingHistoryControllerDto";
	// VideoCommentControllerDto
	export type { CancelVideoCommentDownvoteRequestDto, CancelVideoCommentUpvoteRequestDto, EmitVideoCommentDownvoteRequestDto, EmitVideoCommentRequestDto, EmitVideoCommentUpvoteRequestDto, GetVideoCommentByKvidRequestDto, GetVideoCommentByKvidResponseDto, VideoCommentResult } from "api/Comment/VideoCommentControllerDto";
	// DanmakuControllerDto
	export type { EmitDanmakuRequestDto, GetDanmakuByKvidRequestDto } from "api/Danmaku/DanmakuControllerDto";
	// UserControllerDto
	export type { AdminClearUserInfoRequestDto, AdminGetUserInfoResponseDto, ApproveUserInfoRequestDto, BlockUserByUIDRequestDto, CheckInvitationCodeRequestDto, CheckUserHave2FARequestDto, CheckUserHave2FAResponseDto, CheckUsernameRequestDto, ConfirmUserTotpAuthenticatorRequestDto, DeleteTotpAuthenticatorByTotpVerificationCodeRequestDto, DeleteUserEmailAuthenticatorRequestDto, ForgotPasswordRequestDto, GetBlockedUserResponseDto, GetMyInvitationCodeResponseDto, GetSelfUserInfoByUuidResponseDto, GetSelfUserInfoRequestDto, GetUserInfoByUidRequestDto, GetUserInfoByUidResponseDto, GetUserSettingsRequestDto, GetUserSettingsResponseDto, ReactivateUserByUIDRequestDto, RequestSendChangeEmailVerificationCodeRequestDto, RequestSendChangePasswordVerificationCodeRequestDto, RequestSendForgotPasswordVerificationCodeRequestDto, RequestSendVerificationCodeRequestDto, SendUserDeleteEmailAuthenticatorVerificationCodeRequestDto, SendUserEmailAuthenticatorVerificationCodeRequestDto, UpdateOrCreateUserInfoRequestDto, UpdateOrCreateUserSettingsRequestDto, UpdateUserEmailRequestDto, UpdateUserPasswordRequestDto, UserEmailExistsCheckRequestDto, UserLabelSchema, UserLinkedAccountsVisibilitiesSettingDto, UserLoginRequestDto, UserPrivaryVisibilitiesSettingDto, UserRegistrationRequestDto } from "api/User/UserControllerDto";
	// VideoControllerDto
	export type { ApprovePendingReviewVideoRequestDto, CheckVideoExistRequestDto, DeleteVideoRequestDto, GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, PendingReviewVideoResponseDto, SearchVideoByKeywordRequestDto, SearchVideoByKeywordResponseDto, SearchVideoByVideoTagIdRequestDto, ThumbVideoResponseDto, UploadVideoRequestDto } from "api/Video/VideoControllerDto";
	// VideoTagControllerDto
	export type { CreateVideoTagRequestDto, GetVideoTagByTagIdRequestDto, VideoTag } from "api/VideoTag/VideoTagControllerDto";
	// FeedControllerDto
	export type { FollowingUploaderRequestDto, UnfollowingUploaderRequestDto } from "api/Feed/FeedControllerDto";
	// BlockListDto
	export type { AddRegexRequestDto, BlockKeywordRequestDto, BlockTagRequestDto, BlockUserByUidRequestDto, GetBlockListRequestDto, GetBlockListResponseDto, HideUserByUidRequestDto, RemoveRegexRequestDto, ShowUserByUidRequestDto, UnblockKeywordRequestDto, UnblockTagRequestDto, UnblockUserByUidRequestDto } from "api/BlockList/BlockControllerDto";
	// BlockListDto
	export type { AdminUpdateUserRoleRequestDto } from "api/Rbac/RbacControllerDto";
}

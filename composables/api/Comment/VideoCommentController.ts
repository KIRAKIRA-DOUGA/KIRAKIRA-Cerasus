import { DELETE, GET, POST } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { CancelVideoCommentDownvoteRequestDto, CancelVideoCommentUpvoteRequestDto, DeleteSelfVideoCommentRequestDto, DeleteSelfVideoCommentResponseDto, AdminDeleteVideoCommentRequestDto, AdminDeleteVideoCommentResponseDto, EmitVideoCommentDownvoteRequestDto, EmitVideoCommentDownvoteResponseDto, EmitVideoCommentRequestDto, EmitVideoCommentResponseDto, EmitVideoCommentUpvoteRequestDto, EmitVideoCommentUpvoteResponseDto, GetVideoCommentByKvidRequestDto, GetVideoCommentByKvidResponseDto } from "./VideoCommentControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_COMMENT_API_URL = `${BACK_END_URL}/video/comment`;

/**
 * 用户发送视频评论
 * @param emitVideoCommentRequest 用户发送的视频评论的请求载荷
 * @returns 用户发送视频评论的结果
 */
export const emitVideoComment = async (emitVideoCommentRequest: EmitVideoCommentRequestDto): Promise<EmitVideoCommentResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${VIDEO_COMMENT_API_URL}/emit`, emitVideoCommentRequest, { credentials: "include" }) as EmitVideoCommentResponseDto;
};

/**
 * 根据 kvid 获取视频评论列表
 * @param getVideoCommentByKvidRequest 请求视频评论列表的查询参数
 * @returns 视频的视频评论列表
 */
export const getVideoCommentByKvid = async (getVideoCommentByKvidRequest: GetVideoCommentByKvidRequestDto): Promise<GetVideoCommentByKvidResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await GET(`${VIDEO_COMMENT_API_URL}?videoId=${getVideoCommentByKvidRequest.videoId}&page=${getVideoCommentByKvidRequest.pagination.page}&pageSize=${getVideoCommentByKvidRequest.pagination.pageSize}`, { credentials: "include" }) as GetVideoCommentByKvidResponseDto;
};

/**
 * 用户为视频评论点赞
 * @param emitVideoCommentUpvoteRequest 用户为视频评论点赞的请求载荷
 * @returns 用户为视频评论点赞的结果
 */
export const emitVideoCommentUpvote = async (emitVideoCommentUpvoteRequest: EmitVideoCommentUpvoteRequestDto): Promise<EmitVideoCommentUpvoteResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${VIDEO_COMMENT_API_URL}/upvote`, emitVideoCommentUpvoteRequest, { credentials: "include" }) as EmitVideoCommentUpvoteResponseDto;
};

/**
 * 用户为视频评论点踩
 * @param emitVideoCommentDownvoteRequest 用户为视频评论点踩的请求载荷
 * @returns 用户为视频评论点踩的结果
 */
export const emitVideoCommentDownvote = async (emitVideoCommentDownvoteRequest: EmitVideoCommentDownvoteRequestDto): Promise<EmitVideoCommentDownvoteResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${VIDEO_COMMENT_API_URL}/downvote`, emitVideoCommentDownvoteRequest, { credentials: "include" }) as EmitVideoCommentDownvoteResponseDto;
};

/**
 * 用户取消一个视频评论的点赞
 * @param cancelVideoCommentUpvoteRequest 用户取消一个视频评论的点赞的请求载荷
 * @returns 用户取消一个视频评论的点赞的结果
 */
export const cancelVideoCommentUpvote = async (cancelVideoCommentUpvoteRequest: CancelVideoCommentUpvoteRequestDto): Promise<EmitVideoCommentUpvoteResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${VIDEO_COMMENT_API_URL}/upvote/cancel`, cancelVideoCommentUpvoteRequest, { credentials: "include" }) as EmitVideoCommentUpvoteResponseDto;
};

/**
 * 用户取消一个视频评论的点踩
 * @param cancelVideoCommentDownvoteRequest 用户取消一个视频评论的点踩的请求载荷
 * @returns 用户取消一个视频评论的点踩的结果
 */
export const cancelVideoCommentDownvote = async (cancelVideoCommentDownvoteRequest: CancelVideoCommentDownvoteRequestDto): Promise<EmitVideoCommentDownvoteResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${VIDEO_COMMENT_API_URL}/downvote/cancel`, cancelVideoCommentDownvoteRequest, { credentials: "include" }) as EmitVideoCommentDownvoteResponseDto;
};

/**
 * 删除一条自己发布的视频评论
 * @param deleteSelfVideoCommentRequest 删除一条自己发布的视频评论的请求载荷
 * @returns 删除一条自己发布的视频评论的请求响应
 */
export const deleteSelfVideoComment = async (deleteSelfVideoCommentRequest: DeleteSelfVideoCommentRequestDto): Promise<DeleteSelfVideoCommentResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${VIDEO_COMMENT_API_URL}/deleteSelfComment`, deleteSelfVideoCommentRequest, { credentials: "include" }) as DeleteSelfVideoCommentResponseDto;
};

/**
 * 管理员删除一条视频评论
 * @param dadminDeleteVideoCommentRequest 管理员删除一条视频评论的请求载荷
 * @returns 管理员删除一条视频评论的请求响应
 */
export const adminDeleteVideoComment = async (dadminDeleteVideoCommentRequest: AdminDeleteVideoCommentRequestDto): Promise<AdminDeleteVideoCommentResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await DELETE(`${VIDEO_COMMENT_API_URL}/adminDeleteComment`, dadminDeleteVideoCommentRequest, { credentials: "include" }) as AdminDeleteVideoCommentResponseDto;
};

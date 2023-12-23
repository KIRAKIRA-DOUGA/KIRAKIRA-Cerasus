import { post } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { EmitVideoCommentDownvoteRequestDto, EmitVideoCommentDownvoteResponseDto, EmitVideoCommentRequestDto, EmitVideoCommentResponseDto, EmitVideoCommentUpvoteRequestDto, EmitVideoCommentUpvoteResponseDto, GetVideoCommentByKvidRequestDto, GetVideoCommentByKvidResponseDto } from "./VideoCommentControllerDto";

const BACK_END_URL = getCorrectUri();
const USER_API_URI = `${BACK_END_URL}/video/comment`;

/**
 * 用户发送视频评论
 * @param emitVideoCommentRequest 用户发送的视频评论的请求载荷
 * @returns 用户发送视频评论的结果
 */
export const emitVideoComment = async (emitVideoCommentRequest: EmitVideoCommentRequestDto): Promise<EmitVideoCommentResponseDto> => {
	// TODO use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/emit`, emitVideoCommentRequest, { credentials: "include" }) as EmitVideoCommentResponseDto;
};

/**
 * 根据 kvid 获取视频评论列表
 * @param getVideoCommentByKvidRequest 请求视频评论列表的查询参数
 * @returns 视频的视频评论列表
 */
export const getVideoCommentByKvid = async (getVideoCommentByKvidRequest: GetVideoCommentByKvidRequestDto): Promise<GetVideoCommentByKvidResponseDto> => {
	const { data: result } = await useFetch<GetVideoCommentByKvidResponseDto>(`${USER_API_URI}?videoId=${getVideoCommentByKvidRequest.videoId}`);
	if (result.value)
		return result.value;
	else
		return { success: false, message: "获取首页视频失败", videoCommentCount: 0, videoCommentList: [] };
};

/**
 * 用户为视频评论点赞
 * @param emitVideoCommentUpvoteRequest 用户为视频评论点赞的请求载荷
 * @returns 用户为视频评论点赞的结果
 */
export const emitVideoCommentUpvote = async (emitVideoCommentUpvoteRequest: EmitVideoCommentUpvoteRequestDto): Promise<EmitVideoCommentUpvoteResponseDto> => {
	// TODO use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/upvote`, emitVideoCommentUpvoteRequest, { credentials: "include" }) as EmitVideoCommentUpvoteResponseDto;
};

/**
 * 用户为视频评论点踩
 * @param emitVideoCommentDownvoteRequest 用户为视频评论点踩的请求载荷
 * @returns 用户为视频评论点踩的结果
 */
export const emitVideoCommentDownvote = async (emitVideoCommentDownvoteRequest: EmitVideoCommentDownvoteRequestDto): Promise<EmitVideoCommentDownvoteResponseDto> => {
	// TODO use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await post(`${USER_API_URI}/downvote`, emitVideoCommentDownvoteRequest, { credentials: "include" }) as EmitVideoCommentDownvoteResponseDto;
};

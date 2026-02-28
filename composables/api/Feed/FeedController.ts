import type { FollowingUploaderRequestDto, FollowingUploaderResponseDto, UnfollowingUploaderRequestDto, UnfollowingUploaderResponseDto, GetFollowStatsResponseDto, GetFollowingListResponseDto, GetFollowerListResponseDto } from "./FeedControllerDto";

const BACK_END_URI = environment.backendUri;
const FEED_API_URI = `${BACK_END_URI}feed`;

/**
 * 用户关注一个创作者
 * @param followingUploaderRequest - 用户关注一个创作者的请求载荷
 * @returns 用户关注一个创作者的请求响应
 */
export const followingUploader = (followingUploaderRequest: FollowingUploaderRequestDto) => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return $fetch<FollowingUploaderResponseDto>(
		`${FEED_API_URI}/following`,
		{
			method: "POST",
			body: { ...followingUploaderRequest },
			credentials: "include",
		},
	);
};

/**
 * 用户取消关注一个创作者
 * @param unfollowingUploaderRequest - 用户取消关注一个创作者的请求载荷
 * @returns 用户取消关注一个创作者的请求响应
 */
export const unfollowingUploader = (unfollowingUploaderRequest: UnfollowingUploaderRequestDto) => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return $fetch<UnfollowingUploaderResponseDto>(
		`${FEED_API_URI}/unfollowing`,
		{
			method: "POST",
			body: { ...unfollowingUploaderRequest },
			credentials: "include",
		},
	);
};

/**
 * 获取用户关注数和粉丝数
 * @param targetUid - 目标用户的 UID
 * @param headerCookie - 请求头中的 cookie（可选，用于已登录用户）
 * @returns 获取用户关注数和粉丝数的请求响应
 */
export const getFollowStats = (targetUid: number, headerCookie?: Record<string, string>) => {
	return $fetch<GetFollowStatsResponseDto>(
		`${FEED_API_URI}/stats`,
		{
			method: "GET",
			query: { targetUid },
			credentials: "include",
			headers: headerCookie,
		},
	);
};

/**
 * 获取用户关注列表
 * @param targetUid - 目标用户的 UID
 * @param page - 当前页码
 * @param pageSize - 每页显示数量
 * @param headerCookie - 请求头中的 cookie（可选，用于已登录用户）
 * @returns 获取用户关注列表的请求响应
 */
export const getFollowingList = (targetUid: number, page: number, pageSize: number, headerCookie?: Record<string, string>) => {
	return $fetch<GetFollowingListResponseDto>(
		`${FEED_API_URI}/following/list`,
		{
			method: "GET",
			query: { targetUid, page, pageSize },
			credentials: "include",
			headers: headerCookie,
		},
	);
};

/**
 * 获取用户粉丝列表
 * @param targetUid - 目标用户的 UID
 * @param page - 当前页码
 * @param pageSize - 每页显示数量
 * @param headerCookie - 请求头中的 cookie（可选，用于已登录用户）
 * @returns 获取用户粉丝列表的请求响应
 */
export const getFollowerList = (targetUid: number, page: number, pageSize: number, headerCookie?: Record<string, string>) => {
	return $fetch<GetFollowerListResponseDto>(
		`${FEED_API_URI}/follower/list`,
		{
			method: "GET",
			query: { targetUid, page, pageSize },
			credentials: "include",
			headers: headerCookie,
		},
	);
};

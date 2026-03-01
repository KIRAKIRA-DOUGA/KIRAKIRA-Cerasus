import type { FollowingUploaderRequestDto, FollowingUploaderResponseDto, UnfollowingUploaderRequestDto, UnfollowingUploaderResponseDto } from "./FeedControllerDto";

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

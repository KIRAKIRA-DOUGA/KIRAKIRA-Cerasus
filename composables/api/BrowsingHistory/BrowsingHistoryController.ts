import getCorrectUri from "../Common/getCorrectUri";
import type { GetUserBrowsingHistoryWithFilterRequestDto, GetUserBrowsingHistoryWithFilterResponseDto } from "./BrowsingHistoryControllerDto";

const BACK_END_URL = getCorrectUri();
const BROWSING_HISTORY_API_URL = `${BACK_END_URL}/history`;

/**
 * 获取全部或过滤后的用户浏览历史，按对某一内容的最后访问时间降序排序
 * @param getUserBrowsingHistoryWithFilterRequest 获取全部或过滤后的用户浏览历史的请求参数
 * @param headerCookie 从客户端发起 SSR 请求时传递的 Header 中的 Cookie 部分，在 SSR 时将其转交给后端 API
 * @returns 获取全部或过滤后的用户浏览历史的请求响应结果
 */
export const getUserBrowsingHistoryWithFilter = async (getUserBrowsingHistoryWithFilterRequest: GetUserBrowsingHistoryWithFilterRequestDto, headerCookie: { cookie?: string | undefined }): Promise<GetUserBrowsingHistoryWithFilterResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	// NOTE: use { headers: headerCookie } to passing client-side cookies to backend API when SSR.
	const { data: result } = await useFetch<GetUserBrowsingHistoryWithFilterResponseDto>(`${BROWSING_HISTORY_API_URL}/filter?videoTitle=${getUserBrowsingHistoryWithFilterRequest.videoTitle}`, { headers: headerCookie, credentials: "include" });
	if (result.value)
		return result.value;
	else
		return { success: false, message: "获取全部或过滤后的用户浏览历史失败" };
};

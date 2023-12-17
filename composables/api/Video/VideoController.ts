import getCorrectUri from "api/Common/getCorrectUri";
import type { GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, ThumbVideoResponseDto } from "./VideoControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_API_URI = `${BACK_END_URL}/video`;

/**
 * 获取主页中显示的视频
 * @returns 展示视频卡片需要的返回参数
 */
export const getHomePageThumbVideo = async (): Promise<ThumbVideoResponseDto> => {
	const { data: result } = await useFetch<ThumbVideoResponseDto>(`${VIDEO_API_URI}/home`);
	if (result.value)
		return result.value;
	else
		return { success: false, videosCount: 0, videos: [], message: "获取首页视频失败" };
};

/**
 * 根据视频 ID (KVID) 获取视频的数据
 * @param getVideoByKvidRequest 从视频 ID 获取视频的请求参数
 * @returns 视频页面需要的响应
 */
export const getVideoByKvid = async (getVideoByKvidRequest: GetVideoByKvidRequestDto): Promise<GetVideoByKvidResponseDto> => {
	if (getVideoByKvidRequest && getVideoByKvidRequest.videoId) {
		const { data: result } = await useFetch<GetVideoByKvidResponseDto>(`${VIDEO_API_URI}?videoId=${getVideoByKvidRequest.videoId}`);
		if (result.value)
			return result.value;
		else
			return { success: false, message: "获取视频失败" };
	} else
		return { success: false, message: "未提供 KVID" };
};

/**
 * 根据 UID 获取该用户上传的视频
 * @param getVideoByUidRequest 根据 UID 获取该用户上传的视频的请求参数
 * @returns 根据 UID 获取该用户上传的视频的请求响应结果
 */
export const getVideoByUid = async (getVideoByUidRequest: GetVideoByUidRequestDto): Promise<GetVideoByUidResponseDto> => {
	if (getVideoByUidRequest && getVideoByUidRequest.uid) {
		const { data: result } = await useFetch<GetVideoByUidResponseDto>(`${VIDEO_API_URI}/user?uid=${getVideoByUidRequest.uid}`);
		if (result.value)
			return result.value;
		else
			return { success: false, message: "获取用户上传的视频失败", videosCount: 0, videos: [] };
	} else
		return { success: false, message: "未提供 UID", videosCount: 0, videos: [] };
};

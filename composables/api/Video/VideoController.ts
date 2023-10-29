import getCorrectUri from "api/Common/getCorrectUri";
import type { GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, ThumbVideoResponseDto } from "./VideoControllerDto";

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
 * 获取视频数据
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
		return { success: false, message: "未获取到视频编号" };
};

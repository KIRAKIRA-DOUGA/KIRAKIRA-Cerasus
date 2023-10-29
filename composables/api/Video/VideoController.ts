import getCorrectUri from "api/Common/getCorrectUri";
import type { GetVideoByKvidResponseDto, ThumbVideoResponseDto, GetVideoByKvidRequestDto } from "./VideoControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_API_URI = `${BACK_END_URL}/video`;

export const getHomePageThumbVideo = async (): Promise<ThumbVideoResponseDto> => {
	const { data: result } = await useFetch<ThumbVideoResponseDto>(`${VIDEO_API_URI}/home`);
	if (result.value)
		return result.value;
	else
		return { success: false, videosCount: 0, videos: [], message: "获取首页视频失败" };
};

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

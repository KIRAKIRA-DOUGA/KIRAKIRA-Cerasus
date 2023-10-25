import { GetVideoByKvidResponseDto, ThumbVideoResponseDto, getVideoByKvidRequestDto } from "./VideoControllerDto";

const VIDEO_API_URI = "https://localhost:9999/video";

export const getHomePageThumbVideo = async (): Promise<ThumbVideoResponseDto> => {
	const { data: result } = await useFetch<ThumbVideoResponseDto>(`${VIDEO_API_URI}/home`);
	if (result.value)
		return result.value;
	else
		return { success: false, videosCount: 0, videos: [], message: "获取首页视频失败" };
};

export const getVideoByKvid = async (getVideoByKvidRequest: getVideoByKvidRequestDto): Promise<GetVideoByKvidResponseDto> => {
	if (getVideoByKvidRequest && getVideoByKvidRequest.videoId) {
		const { data: result } = await useFetch<GetVideoByKvidResponseDto>(`${VIDEO_API_URI}?videoId=${getVideoByKvidRequest.videoId}`);
		if (result.value)
			return result.value;
		else
			return { success: false, message: "获取视频失败" };
	} else
		return { success: false, message: "未获取到视频编号" };
};

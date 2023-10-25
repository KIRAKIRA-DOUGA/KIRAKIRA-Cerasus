/**
 * @param id 分P ID
 * @param 视频 分P 标题
 * @param 视频直链
 */
type videoPartDto = {
	id: number;
	videoPartTitle: string;
	link: string;
};
/**
 * 展示视频卡片返回的参数
 * @param videoPart 每 P 视频的数据
		* @param videoPartDto[] 每 P 视频的数据
 * @param title 视频标题
 * @param image 封面图链接
 * @param uploader 视频作者 ID
 * @param uploaderId 创作者 UID
 * @param duration 视频时长，单位 ms
 * @param description 视频描述
 */
export type UploadVideoRequestDto = {
	videoPart: videoPartDto[];
	title: string;
	image: string;
	uploader: string;
	uploaderId: number;
	duration: number;
	description?: string;
};

/**
 * 视频上传的返回的参数
 * @param success 是否请求成功
 * @param message 附加的文本消息
 * @parma videoId 视频 ID
 */
export type UploadVideoResponseDto = {
	success: boolean;
	message?: string;
	videoId?: number;
};

// export type ThumbVideoRequestDto = {
// 	username: string;
// }

/**
 * 展示视频卡片需要的返回参数
 * @param success 是否请求成功
 * @param message 附加的文本消息
 * @param videosCount 获取到的视频数量，如果没获取到则为 0
 * @param videos 请求到的视频的数据
		* @param videoId KVID 视频 ID
		* @param title 视频标题
		* @param image 封面图链接
		* @param updateDate 频上传的日期，时间戳格式
		* @param watchedCount 视频播放量
		* @param uploader 视频作者 ID
		* @param uploaderId 创作者 UID
		* @param duration 视频时长，单位 ms
		* @param description 视频描述
 */
export type ThumbVideoResponseDto = {
	success: boolean;
	message?: string;
	videosCount: number;
	videos: {
		videoId: number;
		title: string;
		image?: string;
		updateDate?: number;
		watchedCount?: number;
		uploader?: string;
		uploaderId?: number;
		duration?: number;
		description?: string;
	}[];
};

/**
 * @param videoId kvid 视频的自增 ID
 */
export type getVideoByKvidRequestDto = {
	videoId: number;
};

/**
 * 视频页面需要的响应
 * @param success 是否请求成功
 * @param message 附加的文本消息
 * @param videosCount 获取到的视频数量，如果没获取到则为 0
 * @param video 请求到的视频的数据
		* @param videoId KVID 视频 ID
		* @param videoPart 视频 分P 数据
				* @param videoPartDto[] 视频 分P 数据
		* @param title 视频标题
		* @param image 封面图链接
		* @param updateDate 频上传的日期，时间戳格式
		* @param watchedCount 视频播放量
		* @param uploader 视频作者 ID
		* @param uploaderId 创作者 UID
		* @param duration 视频时长，单位 ms
		* @param description 视频描述
 */
export type GetVideoByKvidResponseDto = {
	success: boolean;
	message?: string;
	video?: {
		videoId: number;
		videoPart: videoPartDto[];
		title: string;
		image?: string;
		updateDate?: number;
		watchedCount?: number;
		uploader?: string;
		uploaderId?: number;
		duration?: number;
		description?: string;
	};
};

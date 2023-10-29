/**
 * 单个视频分 P 数据参数
 */
type VideoPartDto = {
	/** 分 P ID */
	id: number;
	/** 视频分 P 标题 */
	videoPartTitle: string;
	/** 视频直链 */
	link: string;
};
/**
 * 展示视频卡片返回的参数
 */
export type UploadVideoRequestDto = {
	/** 每 P 视频的数据 */
	videoPart: VideoPartDto[];
	/** 视频标题 */
	title: string;
	/** 封面图链接 */
	image: string;
	/** 视频作者 ID */
	uploader: string;
	/** 创作者 UID */
	uploaderId: number;
	/** 视频时长，单位 ms */
	duration: number;
	/** 视频描述 */
	description?: string;
};

/**
 * 视频上传的返回的参数
 */
export type UploadVideoResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 视频 ID */
	videoId?: number;
};

// export type ThumbVideoRequestDto = {
// 	username: string;
// }

/**
 * 展示视频卡片需要的返回参数
 */
export type ThumbVideoResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 获取到的视频数量，如果没获取到则为 0 */
	videosCount: number;
	/** 请求到的视频的数据 */
	videos: {
		/** 视频 ID (KVID) */
		videoId: number;
		/** 视频标题 */
		title: string;
		/** 封面图链接 */
		image?: string;
		/** 视频上传的日期，时间戳格式 */
		updateDate?: number;
		/** 视频播放量 */
		watchedCount?: number;
		/** 视频作者 ID */
		uploader?: string;
		/** 创作者 UID */
		uploaderId?: number;
		/** 视频时长，单位 ms */
		duration?: number;
		/** 视频描述 */
		description?: string;
	}[];
};

/**
 * 从视频 ID 获取视频的请求参数
 */
export type GetVideoByKvidRequestDto = {
	/** 视频 ID (KVID) */
	videoId: number;
};

/**
 * 视频页面需要的响应
 */
export type GetVideoByKvidResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求到的视频的数据 */
	video?: {
		/** 视频 ID (KVID) */
		videoId: number;
		/** 视频分 P 数据 */
		videoPart: VideoPartDto[];
		/** 视频标题 */
		title: string;
		/** 封面图链接 */
		image?: string;
		/** 视频上传的日期，时间戳格式 */
		updateDate?: number;
		/** 视频播放量 */
		watchedCount?: number;
		/** 视频作者 ID */
		uploader?: string;
		/** 创作者 UID */
		uploaderId?: number;
		/** 视频时长，单位 ms */
		duration?: number;
		/** 视频描述 */
		description?: string;
	};
};

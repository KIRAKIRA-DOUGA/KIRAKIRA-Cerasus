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
}

/**
 * 视频 TAG 的数据
 */
type VideoTagDto = {
	/** 非空 - 视频的 TAG ID */
	tagId: number;
	/** 非空 - 视频 TAG 的名称 */
	tag: string;
	/** TAG 描述 */
	description?: string;
}

/**
 * 上传视频的请求参数
 */
export type UploadVideoRequestDto = {
	/** 每 P 视频的数据 */
	videoPart: VideoPartDto[];
	/** 视频标题 */
	title: string;
	/** 封面图链接 */
	image: string;
	/** 创作者 UID */
	uploaderId: number;
	/** 视频时长，单位 ms */
	duration: number;
	/** 视频描述 */
	description?: string;
	/** 视频分区 */
	videoCategory: string;
	/** 视频版权 */
	copyright: string;
	/** 视频 TAG */
	videoTags: VideoTagDto[];
}

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
}

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
		uploadDate?: number;
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
}

/**
 * 从视频 ID 获取视频的请求参数
 */
export type GetVideoByKvidRequestDto = {
	/** 视频 ID (KVID) */
	videoId: number;
}

/**
 * 上传视频的用户信息
 */
type UploaderInfoDto = {
	/** 用户 ID */
	uid: number;
	/** 用户名 */
	username?: string;
	/** 用户头像的链接 */
	avatar?: string;
	/** 用户背景图片的链接 */
	userBannerImage?: string;
	/** 用户的个性签名 */
	signature?: string;
}

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
		uploadDate?: number;
		/** 视频播放量 */
		watchedCount?: number;
		/** 视频作者 ID */
		uploader?: string;
		/** 创作者 UID */
		uploaderId?: number;
		/** 视频作者信息 */
		uploaderInfo?: UploaderInfoDto;
		/** 视频时长，单位 ms */
		duration?: number;
		/** 视频描述 */
		description?: string;
		/** 视频分区 */
		videoCategory: string;
		/** 视频版权 */
		copyright: string;
		/** 视频 TAG */
		videoTags: VideoTagDto[];
	};
}

/**
 * 从 UID 获取视频的请求参数
 */
export type GetVideoByUidRequestDto = {
	/** 用户的 UID */
	uid: number;
}

/**
 * 从 UID 获取视频的请求的响应结果
 */
export type GetVideoByUidResponseDto = ThumbVideoResponseDto & {}


/**
 * 根据关键字搜索视频的请求参数
 */
export type SearchVideoByKeywordRequestDto = {
	keyword: string;
}

/**
 * 根据关键字搜索视频的响应结果
 */
export type SearchVideoByKeywordResponseDto = ThumbVideoResponseDto & {}


/**
 * 获取视频文件 TUS 上传端点请求参数
 */
export type GetVideoFileTusEndpointRequestDto = {
	/** 视频上传分片大小，Cloudflare 只支持 256KiB 的倍数，最小 5242880 子节，最大 209715200 子节，建议 52428800 子节 */
	uploadLength: number;
	/** 视频元数据 */
	uploadMetadata: string;
}

import type { ThumbVideoResponseDto } from "../Video/VideoControllerDto";

/**
 * 浏览的内容的类型
 */
export type BROWSING_HISTORY_CATEGORY = "video" | "photo" | "comment";

/**
 * 用户浏览历史
 */
type BrowsingHistory = {
	/** 用户的 UID - 非空 */
	uid: number;
	/** 浏览的内容的类型，比如说 video, photo 等 - 非空 */
	category: BROWSING_HISTORY_CATEGORY;
	/** 浏览的内容的唯一 ID - 非空 */
	id: string;
	/** 浏览的定位锚点，如果是视频就是播放时间，如果是相册可能是上次浏览到相册第n张图片，为了兼容性使用 String */
	anchor?: string;
};

/**
 * 创建用户浏览历史的请求载荷
 */
export type CreateOrUpdateBrowsingHistoryRequestDto = BrowsingHistory & {};

/**
 * 创建用户浏览历史的请求响应
 */
export type CreateOrUpdateBrowsingHistoryResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回创建的这个浏览历史数据 */
	result?: BrowsingHistory;
};

/**
 * 获取用户浏览历史的请求载荷
 * 主要是用爱装过滤条件
 */
export type GetUserBrowsingHistoryWithFilterRequestDto = {
	/** 过滤条件 - 视频标题 */
	videoTitle?: string;
};

/**
 * 获取用户浏览历史的请求响应，全部或过滤后的用户浏览历史
 */
export type GetUserBrowsingHistoryWithFilterResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回创建的这个浏览历史数据 */
	result?: (
		BrowsingHistory
		& {
			/** 最后更新时间 */
			lastUpdateDateTime: number;
		}
		& ThumbVideoResponseDto["videos"][number])[];
};

/**
 * 视频 TAG 名
 */
type VideoTagNameSchema = {
	/** TAG 名称 - 非空 */
	name: string;
	/** 是否为该语言默认名 - 非空 */
	isDefault: boolean;
	/** 是否为 TAG 原名 - 非空 */
	isOriginalTagName: boolean;
}

/**
 * 不同语言所对应的 TAG 名
 */
type MultilingualVideoTagNameSchema = {
	/** TAG 的语言 - 非空，原则上应该唯一 // WARN: 无法指定指定子文档的唯一索引，只能在业务上避免并做校验 */
	lang: string;
	/** 不同语言所对应的 TAG 名 */
	tagName: VideoTagNameSchema[];
}

/**
 * 创建视频 TAG 的请求载荷
 */
export type CreateVideoTagRequestDto = {
	/** 不同语言所对应的 TAG 名 */
	tagNameList: MultilingualVideoTagNameSchema[];
}

/**
 * 视频 TAG 类型
 */
export type VideoTag = {
	/** TAG ID */
	tagId: number;
	/** 不同语言所对应的 TAG 名 */
	tagNameList: MultilingualVideoTagNameSchema[];
}

/**
 * 创建视频 TAG 的请求响应
 */
export type CreateVideoTagResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回创建的这个 TAG 的信息 */
	result?: VideoTag;
}


/**
 * 搜索视频 TAG 的请求载荷
 */
export type SearchVideoTagRequestDto = {
	/** TAG 名搜索关键词 */
	tagNameSearchKey: string;
}

/**
 * 搜索视频 TAG 的请求响应
 */
export type SearchVideoTagResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回匹配到的 TAG 信息 */
	result?: VideoTag[];
}

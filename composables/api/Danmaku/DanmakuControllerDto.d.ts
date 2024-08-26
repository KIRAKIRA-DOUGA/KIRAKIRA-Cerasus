/**
 * 基础弹幕数据
 */
type BasicDanmakuDto = {
	/** 非空 - KVID 视频 ID */
	videoId: number;
	/** 非空 - 弹幕发送的时机，单位：秒（支持小数） */
	time: number;
	/** 非空 - 弹幕文本 */
	text: string;
	/** 非空 - 弹幕颜色 */
	color: string;
	/** 非空 - 弹幕字体大小，后端只存储三种数据，在前端再映射为 css 可用的像素值 */
	fontSIze: "small" | "medium" | "large";
	/** 非空 - 弹幕发射模式，默认 'rtl' —— 从右舷向左发射 */
	mode: "ltr" | "rtl" | "top" | "bottom";
	/** 非空 - 是否启用彩虹弹幕，默认不启用 */
	enableRainbow: boolean;
};

/**
 * 发送弹幕的请求的数据
 */
export type EmitDanmakuRequestDto = BasicDanmakuDto & {};

/**
 * 发送弹幕的响应的数据
 */
export type EmitDanmakuResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 发送成功的话，返回发送时的弹幕的数据 */
	danmaku?: EmitDanmakuRequestDto;
};

/**
 * 获取视频的弹幕列表的请求的载荷
 */
export type GetDanmakuByKvidRequestDto = {
	/** 非空 - KVID 视频 ID */
	videoId: number;
};

/**
 * 获取视频的弹幕列表的响应中的弹幕
 */
export type GetDanmakuByKvidDto = BasicDanmakuDto & {
	/** 弹幕最后编辑时间 */
	editDateTime: number;
};

/**
 * 获取视频的弹幕列表的响应
 */
export type GetDanmakuByKvidResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 发送成功的话，返回弹幕的数据列表（不包含用户 ID，包含最后编辑时间） */
	danmaku?: GetDanmakuByKvidDto[];
};

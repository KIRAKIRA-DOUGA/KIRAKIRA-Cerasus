/**
 * 基础视频评论数据
 */
type BasicVideoCommentDto = {
	/** KVID 视频 ID */
	videoId: number;
	/** 评论正文 */
	text: string;
};

/**
 * 发送视频评论的请求数据
 */
export type EmitVideoCommentRequestDto = BasicVideoCommentDto;

/**
 * 发送视频评论的响应的数据
 */
export type EmitVideoCommentResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 发送成功的话，返回发送时的评论的数据 */
	videoComment?: VideoCommentResult;
};

/**
 * 获取某个用户在对某个视频的评论的点赞情况的参数
 */
export type GetVideoCommentUpvotePropsDto = {
	/** KVID 视频 ID */
	videoId: number;
	/** 视频评论点赞者的用户的 UID */
	uid: number;
};

/**
 * 获取某个用户在对某个视频的评论的点赞情况的结果
 */
export type GetVideoCommentUpvoteResultDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 某个用户在对某个视频的评论的点赞情况 */
	videoCommentUpvoteResult: {
		/** KVID 视频 ID */
		videoId: number;
		/** 评论的ID */
		commentId: string;
		/** 评论点赞者的用户的 UID */
		uid: number;
		/** 系统专用字段-最后编辑时间 */
		editDateTime: number;
	}[];
};

/**
 * 获取某个用户在对某个视频的评论的点踩情况的参数
 */
export type GetVideoCommentDownvotePropsDto = {
	/** KVID 视频 ID */
	videoId: number;
	/** 视频评论点踩者的用户的 UID */
	uid: number;
};

/**
 * 获取某个用户在对某个视频的评论的点踩情况的结果
 */
export type GetVideoCommentDownvoteResultDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 某个用户在对某个视频的评论的点踩情况 */
	videoCommentDownvoteResult: {
		/** KVID 视频 ID */
		videoId: number;
		/** 评论的ID */
		commentId: string;
		/** 评论点踩者的用户的 UID */
		uid: number;
		/** 系统专用字段-最后编辑时间 */
		editDateTime: number;
	}[];
};

/**
 * 根据 KVID 获取视频评论的请求的参数
 */
export type GetVideoCommentByKvidRequestDto = {
	/** KVID 视频 ID */
	videoId: number;
};

type VideoCommentIdDto = {
	/** 评论的路由 */ /** 如：1.2.3（第一号视频的第二个评论的第三个子回复） */
	commentRoute: string;
	/** 评论 ID */
	upvoteCount: string;
	/** 评论楼层数 */
	commentIndex: number;
};

/**
 * 评论发送者的用户信息
 */
type CommentSenderUserInfo = {
	/** 用户昵称 */
	userNickname?: string;
	/** 用户名 */
	username?: string;
	/** 用户头像的链接 */
	avatar?: string;
	/** 用户背景图片的链接 */
	userBannerImage?: string;
	/** 用户的个性签名 */
	signature?: string;
	/** 用户的性别，男、女和自定义（字符串） */
	gender?: string;
};

/**
 * 一条请求到视频评论
 */
export type VideoCommentResult = {
	/** MongoDB 生成的唯一 ID */
	_id: string;
	/** 评论的路由 */ /** 如：1.2.3（第一号视频的第二个评论的第三个子回复） */
	commentRoute: string;
	/** KVID 视频 ID */
	videoId: number;
	/** 评论发送者的用户的 UID */
	uid: number;
	/** 评论发送者的信息，如 用户名、头像 等 */
	userInfo?: CommentSenderUserInfo;
	/** 发送评论的时间 */
	emitTime: number;
	/** 评论正文 */
	text: string;
	/** 是否已点赞 */
	isUpvote: boolean;
	/** 是否已点踩 */
	isDownvote: boolean;
	/** 评论点赞数 */
	upvoteCount: number;
	/** 评论点踩数 */
	downvoteCount: number;
	/** 评论楼层数 */
	commentIndex: number;
	/** 子评论 */
	subComments: VideoCommentIdDto[];
	/** 该评论的下一级子评论数量 */
	subCommentsCount: number;
	/** 系统专用字段-最后编辑时间 */
	editDateTime: number;
};

/**
 * 获取视频评论的响应结果
 */
export type GetVideoCommentByKvidResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 视频评论总数量 */
	videoCommentCount: number;
	/** 视频评论 */
	videoCommentList: VideoCommentResult[];
};

/**
 * 为视频评论点赞的请求的请求参数
 */
export type EmitVideoCommentUpvoteRequestDto = {
	/** 评论的唯一 ID */
	id: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
* 为视频评论点赞的请求的响应结果
*/
export type EmitVideoCommentUpvoteResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 为视频评论点赞的请求的请求参数
 */
export type CancelVideoCommentUpvoteRequestDto = {
	/** 评论的唯一 ID */
	id: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
* 取消视频评论点赞的请求的响应结果
*/
export type CancelVideoCommentUpvoteResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 为视频评论点踩的请求的请求参数
 */
export type EmitVideoCommentDownvoteRequestDto = {
	/** 评论的唯一 ID */
	id: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
* 为视频评论点踩的请求的响应结果
*/
export type EmitVideoCommentDownvoteResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 为视频评论点踩的请求的请求参数
 */
export type CancelVideoCommentDownvoteRequestDto = {
	/** 评论的唯一 ID */
	id: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
* 取消视频评论点踩的请求的响应结果
*/
export type CancelVideoCommentDownvoteResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 删除一个自己的视频评论的请求载荷
 */
export type DeleteSelfVideoCommentRequestDto = {
	/** 评论的路由 */
	commentRoute: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
 * 删除一个自己的视频评论的请求响应
 */
export type DeleteSelfVideoCommentResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 管理员删除一个视频评论的请求载荷
 */
export type AdminDeleteVideoCommentRequestDto = {
	/** 评论的路由 */
	commentRoute: string;
	/** KVID 视频 ID */
	videoId: number;
};

/**
 * 管理员删除一个视频评论的请求响应
 */
export type AdminDeleteVideoCommentResponseDto = {
	/** 是否请求成功 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

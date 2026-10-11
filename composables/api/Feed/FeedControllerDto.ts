import type { ThumbVideoResponseDto } from "../Video/VideoControllerDto.js";

// marker.ts
const ONLY_IN_TS_FILE = Symbol("ONLY_IN_TS_FILE"); // WARN: DO NOT RENAME THIS FILE AS `*.d.ts`
void ONLY_IN_TS_FILE;

/** 关注的类型 */
export enum FOLLOWING_TYPE {
	/** 通过视频页面或者用户页面等页面的关注按钮正常关注 */
	normal = "normal",
	/** 自动关注 */ // MEME: really?
	auto = "auto",
	/** 通过活动页面关注 */
	event = "event",
	/** 通过活动页面自动批量关注 */
	eventAutoBatch = "eventAutoBatch",
}

/**
 * 用户关注一个创作者的请求载荷
 */
export type FollowingUploaderRequestDto = {
	/** 被关注者 UID */
	followingUid: number;
};

/**
 * 用户关注一个创作者的请求响应
 */
export type FollowingUploaderResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户取消关注一个创作者的请求载荷
 */
export type UnfollowingUploaderRequestDto = {
	/** 取消关注者 UID */
	unfollowingUid: number;
};

/**
 * 用户取消关注一个创作者的请求响应
 */
export type UnfollowingUploaderResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 动态分组
 */
type FeedGroup = {
	/** 动态分组的 UUID - 非空 */
	feedGroupUuid: string;
	/** 动态分组的名称 - 非空 */
	feedGroupName: string;
	/** 动态分组创建者 UUID - 非空 */
	feedGroupCreatorUuid: string;
	/** 动态分组中的用户 - 非空 */
	uuidList: string[];
	/** 动态分组的自定义封面 */
	customCover?: string;
	/** 系统专用字段-最后编辑时间 - 非空 */
	editDateTime: number;
	/** 系统专用字段-创建时间 - 非空 */
	createDateTime: number;
};

/**
 * 创建动态分组的请求载荷
 */
export type CreateFeedGroupRequestDto = {
	/** 动态分组的名字 */
	feedGroupName: string;
	/** 创建动态分组时包含 UID 列表 */
	withUidList?: number[];
};

/**
 * 创建动态分组的请求响应
 */
export type CreateFeedGroupResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 一次添加了太多 UID */
	tooManyUidInOnce: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回新创建的动态分组 */
	feedGroupResult?: FeedGroup;
};

/**
 * 向某一个动态分组中添加 UID 的请求载荷
 */
export type AddNewUid2FeedGroupRequestDto = {
	/** 动态分组的 UUID */
	feedGroupUuid: string;
	/** 要新增的 UID 列表 */
	uidList: number[];
};

/**
 * 向某一个动态分组中添加 UID 的请求响应
 */
export type AddNewUid2FeedGroupResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 一次添加了太多 UID */
	tooManyUidInOnce: boolean;
	/** 动态分组中有太多 UID */
	isOverload: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果修改成功，返回动态分组 */
	feedGroupResult?: FeedGroup;
};

/**
 * 从一个动态分组中移除 UID 的请求载荷
 */
export type RemoveUidFromFeedGroupRequestDto = {
	/** 动态分组的 UUID */
	feedGroupUuid: string;
	/** 要移除的 UID 列表 */
	uidList: number[];
};

/**
 * 从一个动态分组中移除 UID 的请求响应
 */
export type RemoveUidFromFeedGroupResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 一次添加了太多 UID */
	tooManyUidInOnce: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果修改成功，返回动态分组 */
	feedGroupResult?: FeedGroup;
};

/**
 * 删除动态分组的请求载荷
 */
export type DeleteFeedGroupRequestDto = {
	/** 要删除动态分组的 UUID */
	feedGroupUuid: string;
};

/**
 * 删除动态分组的请求响应
 */
export type DeleteFeedGroupResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 获取用于上传动态分组封面图的预签名 URL 的请求响应
 */
export type GetFeedGroupCoverUploadSignedUrlResponseDto = {
	/** 请求是否成功，成功返回 true，否则返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求到的视频封面图上传预签名 URL 数据 */
	result?: {
		/** 预签名 URL */
		signedUrl: string;
		/** POST 上传 URL */
		uploadUrl: string;
		/** 文件名 */
		fileName: string;
		/** 图片对象 URL */
		url: string;
		/** 图片公开 URL */
		publicUrl: string;
		/** POST 上传表单字段 */
		fields: Record<string, string>;
		/** POST 上传表单字段 */
		uploadFields: Record<string, string>;
		/** 上传方法 */
		uploadMethod: "POST";
		/** 图片最大上传大小，单位 byte */
		maxSize: number;
		/** 已签名的 Content-Type */
		contentType: string;
	};
};

/**
 * 创建或更新动态分组信息的请求载荷
 */
export type CreateOrEditFeedGroupInfoRequestDto = {
	/** 要更新的动态分组的 UUID */
	feedGroupUuid: string;
	/** 动态分组的名字 */
	feedGroupName?: string;
};

/***
 * 创建或更新动态分组信息的请求响应
 */
export type CreateOrEditFeedGroupInfoResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 如果成功，返回动态分组 */
	feedGroupResult?: FeedGroup;
};

/**
 * 确认动态分组封面图已上传并写入数据库的请求载荷
 */
export type ConfirmFeedGroupCoverUploadRequestDto = {
	/** 动态分组的 UUID */
	feedGroupUuid: string;
	/** 已上传到 TOS 的对象名 */
	fileName: string;
};

/**
 * 确认动态分组封面图已上传并写入数据库的请求响应
 */
export type ConfirmFeedGroupCoverUploadResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 图片对象 URL */
	url?: string;
	/** 如果成功，返回动态分组 */
	feedGroupResult?: FeedGroup;
};

/**
 * 管理员通过动态分组信息更新审核的请求载荷
 */
export type AdministratorApproveFeedGroupInfoChangeRequestDto = {
	/** 动态分组的 UUID */
	feedGroupUuid: string;
};

/**
 * 管理员通过动态分组信息更新审核的请求响应
 */
export type AdministratorApproveFeedGroupInfoChangeResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 管理员删除动态分组的请求载荷
 */
export type AdministratorDeleteFeedGroupRequestDto = {
	/** 动态分组的 UUID */
	feedGroupUuid: string;
};

/**
 * 管理员删除动态分组的请求响应
 */
export type AdministratorDeleteFeedGroupResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 获取动态分组的请求响应
 */
export type GetFeedGroupListResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 结果 */
	result?: FeedGroup[];
};

/**
 * 获取动态内容的请求载荷
 */
export type GetFeedContentRequestDto = {
	feedGroupUuid?: string;
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 获取动态内容的请求响应
 */
export type GetFeedContentResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 用户是否没有关注其他用户，或者动态分组中没有用户 */
	isLonely: false | {
		/** 没有关注其他用户 */
		noFollowing: boolean;
	} | {
		/** 动态分组中没有用户 */
		noUserInFeedGroup: boolean;
	};
	/** 请求结果 */
	result?: {
		/** 内容数量 */
		count: number;
		/** 内容 */
		content: ThumbVideoResponseDto["videos"];
	};
};

/**
 * 获取用户关注数和粉丝数的请求载荷
 */
export type GetFollowStatsRequestDto = {
	/** 目标用户的 UID */
	targetUid: number;
};

/**
 * 获取用户关注数和粉丝数的请求响应
 */
export type GetFollowStatsResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 关注数 */
	followingCount?: number;
	/** 粉丝数 */
	followerCount?: number;
};

/**
 * 用户信息（用于关注/粉丝列表）
 */
export type UserInfoForFollowList = {
	/** 用户 UID */
	uid: number;
	/** 用户名 */
	username?: string;
	/** 用户昵称 */
	userNickname?: string;
	/** 用户头像 */
	avatar?: string;
	/** 关注时间（仅用于关注列表） */
	followingCreateTime?: number;
	/** 是否已关注该用户（仅用于粉丝列表，表示当前查看者是否关注了该粉丝） */
	isFollowing?: boolean;
};

/**
 * 获取用户关注或粉丝列表的请求载荷
 */
export type GetFollowListRequestDto = {
	/** 目标用户的 UID */
	targetUid: number;
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 获取用户关注或粉丝列表的请求响应
 */
export type GetFollowListResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 总数 */
	totalCount?: number;
	/** 结果列表 */
	result?: UserInfoForFollowList[];
};

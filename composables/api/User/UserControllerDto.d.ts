/**
 * 用户注册提交的参数
 */
export type UserRegistrationRequestDto = {
	/** 用户邮箱 */
	email: string;
	/** 验证码 */
	verificationCode: string;
	/** 在前端已经被 Bcrypt Hash 过一次的的密码 */
	passwordHash: string;
	/** 密码提示 */
	passwordHint?: string;
	/** 注册时使用的邀请码 */
	invitationCode?: string;
	/** 用户名 */
	username: string;
	/** 用户昵称 */
	userNickname?: string;
};

/**
 * 用户注册的返回参数
 */
export type UserRegistrationResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户的 UUID */
	UUID?: string;
	/** 用户 ID */
	uid?: number;
	/** 如果注册成功，则返回一个 token，如果注册失败，则 token 是一个假值（undefined、null 或 ""） */
	token?: string;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户登录提交的参数
 */
export type UserLoginRequestDto = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
	/** 用户输入的一次性验证码 */
	clientOtp?: string;
	/** 用户输入的邮箱验证码 */
	verificationCode?: string;
};

/**
 * 用户登录的返回参数
 */
export type UserLoginResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户邮箱 */
	email?: string;
	/** 用户的 UUID */
	UUID?: string;
	/** 用户 ID */
	uid?: number;
	/** 如果登录成功，则返回一个 token，如果登录失败，则 token 是一个假值（undefined、null 或 ""） */
	token?: string;
	/** 密码提示 */
	passwordHint?: string;
	/** 附加的文本消息 */
	message?: string;
	/** 是否冷却 */
	isCoolingDown?: boolean;
	/** 身份验证器的类型 */
	authenticatorType?: "email" | "totp" | "none";
};

/**
 * 检查用户是否存在的请求参数
 */
export type UserExistsCheckByUIDRequestDto = {
	/** 用户 UID */
	uid: number;
};

/**
 * 检查用户是否存在的请求响应
 */
export type UserExistsCheckByUIDResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户存在返回 true，不存在返回 false */
	exists: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 验证用户邮箱是否存在提交的参数
 */
export type UserEmailExistsCheckRequestDto = {
	/** 用户邮箱 */
	email: string;
};

/**
 * 验证用户邮箱是否已经存在的返回参数
 */
export type UserEmailExistsCheckResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户存在或者查询失败（悲观）都会返回 true，不存在返回 false */
	exists: boolean; // WARN: 用户已存在或查询失败（悲观）时都会返回 true，用以防止用户意外的使用重复邮箱注册。
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户更改邮箱的请求的参数
 */
export type UpdateUserEmailRequestDto = {
	/** 用户 ID */
	uid: number;
	/** 用户的旧邮箱 */
	oldEmail: string;
	/** 用户的新邮箱 */
	newEmail: string;
	/** 经过一次 Hash 的用户密码 */
	passwordHash: string;
	/** 验证码 */
	verificationCode: string;
};

/**
 * 用户更改邮箱返回的参数
 */
export type UpdateUserEmailResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 等待被 Hash 的密码和用户信息
 */
export type BeforeHashPasswordDataType = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
};

/**
 * 用户的个人标签
 */
export type UserLabel = {
	/** 标签 ID */
	id: number;
	/** 标签名 */
	labelName: string;
};

/**
 * 用户的关联账户
 */
export type UserLinkedAccounts = {
	/** 关联账户的平台 - 例："X" */
	platformId: string;
	/** 关联账户唯一标识 */
	accountUniqueId: string;
};

/**
 * 用户的关联网站
 */
export type UserWebsite = {
	/** 关联网站名 - 例："我的个人主页" */
	websiteName: string;
	/** 关联网站 URL */
	websiteUrl: string;
};

/**
 * 更新或创建用户信息时的请求参数
 */
export type UpdateOrCreateUserInfoRequestDto = {
	/** 用户名 */
	username?: string;
	/** 用户昵称 */
	userNickname?: string;
	/** 用户头像的链接 */
	avatar?: string;
	/** 用户背景图片的链接 */
	userBannerImage?: string;
	/** 用户的个性签名 */
	signature?: string;
	/** 用户的性别，男、女和自定义（字符串） */
	gender?: string;
	/** 用户的个人标签 */
	label?: UserLabel[];
	/** 用户生日 */
	userBirthday?: string;
	/** 用户主页 Markdown */
	userProfileMarkdown?: string;
	/** 用户的关联账户 */
	userLinkedAccounts?: UserLinkedAccounts[];
	/** 用户的关联网站 */
	userWebsite?: UserWebsite;
};

/**
 * 更新或创建用户信息的请求结果
 */
export type UpdateOrCreateUserInfoResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求结果 */
	result?: {} & UpdateOrCreateUserInfoRequestDto;
};

/**
 * 获取当前登录的用户信息的请求参数
 */
export type GetSelfUserInfoRequestDto = {
	/** 用户 ID */
	uid: number;
	/** 用户的身分令牌 */
	token: string;
};

/**
 * 通过 UUID 获取当前登录的用户信息的请求参数
 */
export type GetSelfUserInfoByUuidRequestDto = {
	/** UUID */
	uuid: string;
	/** 用户的身分令牌 */
	token: string;
};

/**
 * 获取当前登录的用户信息的请求响应
 */
export type GetSelfUserInfoResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求结果 */
	result?: (
		{
			/** 用户 ID */
			uid?: number;
			/** UUID */
			uuid?: string;
			/** 用户邮箱 */
			email?: string;
			/** 用户创建时间 */
			userCreateDateTime?: number;
			/** 用户的角色 */
			roles?: string[];
			/** 2FA 的类型 */
			authenticatorType?: string;
			/** 使用的邀请码 */
			invitationCode?: string;
		}
		& UpdateOrCreateUserInfoRequestDto
	);
};

/**
 * 通过 UUID 获取当前登录的用户信息的请求响应
 */
export type GetSelfUserInfoByUuidResponseDto = {} & GetSelfUserInfoResponseDto;

/**
 * 通过 UID 获取用户信息的请求载荷
 */
export type GetUserInfoByUidRequestDto = {
	/** 目标用户的 UID */
	uid: number;
};

/**
 * 用户被屏蔽的状态
 */
type BlockState = { isBlockedByOther: boolean; isBlocked: boolean; isHidden: boolean };

/**
 * 通过 UID 获取用户信息的请求响应
 */
export type GetUserInfoByUidResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求结果 */
	result?: {
		/** 用户名 */
		username?: string;
		/** 用户昵称 */
		userNickname?: string;
		/** 用户头像的链接 */
		avatar?: string;
		/** 用户背景图片的链接 */
		userBannerImage?: string;
		/** 用户的个性签名 */
		signature?: string;
		/** 用户的性别，男、女和自定义（字符串） */
		gender?: string;
		/** 用户的个人标签 */
		label?: UserLabel[];
		/** 用户创建时间 */
		userCreateDateTime?: number;
		/** 用户的角色 */
		roles?: string[];
		/** 是否正在关注该用户 */
		isFollowing: boolean;
		/**
		 * 查询的用户是否是自己。
		 * 如果该字段的值为 true，则通常意味着发生了错误的请求，因为有专用的接口用于查询用户自己的信息。
		 */
		isSlef: boolean;
	};
} & BlockState;

/**
 * 通过 UID 和 TOKEN 校验用户的返回结果
 */
export type CheckUserTokenResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 用户校验结果，用户正常为 true，非法用户为 false */
	userTokenOk?: boolean;
};

/**
 * 用户登出的响应
 */
export type UserLogoutResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 获取用于用户上传头像的预签名 URL, 上传限时 60 秒
 */
export type GetUserAvatarUploadSignedUrlResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用于用户上传头像的预签名 URL */
	userAvatarUploadSignedUrl?: string;
	/** 用于用户上传头像文件名 */
	userAvatarFilename?: string;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户隐私数据可见性设置
 */
type UserPrivaryVisibilitiesSettingDto = {
	/** 用户隐私数据项的 ID - 非空 - 例：'birthday', 'follow', 'fans' */
	privaryId: string;
	/** 显示方式 - 非空 - 允许的值有：{public: 公开, following: 仅关注, private: 隐藏} */
	visibilitiesType: "public" | "following" | "private";
};

/**
 * 用户关联平台的隐私可见性设置
 */
type UserLinkedAccountsVisibilitiesSettingDto = {
	/** 关联账户类型 - 非空 - 例："X" */
	platformId: string;
	/** 显示方式 - 非空 - 允许的值有：{public: 公开, following: 仅关注, private: 隐藏} */
	visibilitiesType: "public" | "following" | "private";
};

/**
 * 基础用户个性设置类型
 */
export type BasicUserSettingsDto = {
	/** 是否启用 Cookie - 布尔 */
	enableCookie?: boolean;
	/** 主题外观设置（主题类型） - 可选的值：{light: 浅色, dark: 深色, system: 跟随系统} */
	themeType?: "light" | "dark" | "system";
	/** 主题颜色 - 字符串，颜色字符串 */
	themeColor?: string;
	/** 用户自定义主题颜色 - 字符串，HAX 颜色字符串，不包含井号 */
	themeColorCustom?: string;
	/** 壁纸（背景图 URL） - 字符串 */
	wallpaper?: string;
	/** 是否启用彩色导航栏 - 布尔 */
	coloredSideBar?: boolean;
	/** 流量使用偏好 - 字符串，{standard: 标准, limit: 节省网络流量模式, preview: 超前加载} */
	dataSaverMode?: "standard" | "limit" | "preview";
	/** 禁用搜索推荐 - 布尔 */
	noSearchRecommendations?: boolean;
	/** 禁用相关视频推荐 - 布尔 */
	noRelatedVideos?: boolean;
	/** 禁用搜索历史 - 布尔 */
	noRecentSearch?: boolean;
	/** 禁用视频历史 - 布尔 */
	noViewHistory?: boolean;
	/** 是否在新窗口打开视频 - 布尔 */
	openInNewWindow?: boolean;
	/** 显示语言 - 字符串 */
	currentLocale?: string;
	/** 用户时区 - 字符串 */
	timezone?: string;
	/** 用户单位制度 - 字符串，刻度制或分度值，英制或美制等内容 */
	unitSystemType?: string;
	/** 是否进入了开发者模式 - 布尔 */
	devMode?: boolean;
	/** 用户关联网站的隐私设置 - 允许的值有：{public: 公开, following: 仅关注, private: 隐藏} */
	userWebsitePrivacySetting?: "public" | "following" | "private";
	/** 用户隐私数据可见性设置 */
	userPrivaryVisibilitiesSetting?: UserPrivaryVisibilitiesSettingDto[];
	/** 用户关联账户的隐私设置 */
	userLinkedAccountsVisibilitiesSetting?: UserLinkedAccountsVisibilitiesSettingDto[];
	// /** 实验性：启用直角模式 - 布尔 */
	// sharpAppearanceMode?: boolean;
	// /** 实验性：启用扁平模式 - 布尔 */
	// flatAppearanceMode?: boolean;
};

/**
 * 获取用于渲染页面的用户设定的请求参数
 */
export type GetUserSettingsRequestDto = {} & GetSelfUserInfoRequestDto;

/**
 * 获取用于渲染页面的用户设定的请求响应
 */
export type GetUserSettingsResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户个性设定 */
	userSettings?: { uid: number; editDateTime: number } & BasicUserSettingsDto;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 更新或创建用户设定的请求参数
 */
export type UpdateOrCreateUserSettingsRequestDto = {} & BasicUserSettingsDto;

/**
 * 更新或创建用户设定的请求响应
 */
export type UpdateOrCreateUserSettingsResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户个性设定 */
	userSettings?: { uid: number; editDateTime: number } & BasicUserSettingsDto;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 请求发送用户注册邮箱验证码的请求载荷
 */
export type RequestSendVerificationCodeRequestDto = {
	/** 用户的邮箱 - 非空 - 唯一 */
	email: string;
	/** 用户客户端使用的语言 */
	clientLanguage: string;
};

/**
 * 请求发送用户邮箱验证码的请求响应
 */
export type RequestSendVerificationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 是否达到超时时间 */
	isTimeout: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 邀请码类型
 */
type InvitationCode = {
	/** 生成邀请码的用户 UID - 非空 */
	creatorUid: number;
	/** 生成邀请码的用户 UUID - 非空 */
	creatorUUID: string;
	/** 邀请码 - 非空 */
	invitationCode: string;
	/** 生成邀请码的时间 - 非空 */
	generationDateTime: number;
	/** 邀请码被标记为等待使用中 - 非空 */
	isPending: boolean;
	/** 邀请码被标记为无法使用 - 非空 */
	disabled: boolean;
	/** 使用这个邀请码的用户 */
	assignee?: number;
	/** 邀请码被使用的时间 */
	usedDateTime?: number;
};

/**
 * 生成邀请码的请求响应
 */
export type CreateInvitationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 邀请码生成器是否在冷却中（超出邀请码生成期限才能再次生成） */
	isCoolingDown: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 生成的邀请码 */
	invitationCodeResult?: InvitationCode;
};

/**
 * 获取自己的邀请码的请求响应
 */
export type GetMyInvitationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 邀请码列表 */
	invitationCodeResult: InvitationCode[];
};

/**
 * 管理员根据邀请码查询用户的请求响应
 */
export type AdminGetUserByInvitationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 邀请码查询结果 */
	userInfoResult: {
		/** 用户 UID */
		uid?: number;
		/** 用户 UUID */
		uuid?: string;
	};
};

/**
 * 使用邀请码的的请求载荷
 */
export type UseInvitationCodeDto = {
	/** 被使用的邀请码 */
	invitationCode: string;
	/** 注册者 UID */
	registrantUid: number;
	/** 注册者 UUID */
	registrantUUID: string;
};

/**
 * 使用邀请码的请求响应
 */
export type UseInvitationCodeResultDto = {
	/** 是否成功使用验证码 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 检查一个邀请码是否可用的请求载荷
 */
export type CheckInvitationCodeRequestDto = {
	/** 被使用的邀请码 */
	invitationCode: string;
};

/**
 * 检查一个邀请码是否可用的请求响应
 */
export type CheckInvitationCodeResponseDto = {
	/** 是否成功生成邀请码 */
	success: boolean;
	/** 是否是可用的邀请码 */
	isAvailableInvitationCode: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 请求发送用户更改邮箱验证码的请求载荷
 */
export type RequestSendChangeEmailVerificationCodeRequestDto = {
	/** 用户客户端使用的语言 */
	clientLanguage: string;
	/** 用户的新邮箱 */
	newEmail: string;
};

/**
 * 请求发送用户更改邮箱验证码的请求响应
 */
export type RequestSendChangeEmailVerificationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 是否达到超时时间 */
	isCoolingDown: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 请求发送用户更改密码的验证码的请求载荷
 */
export type RequestSendChangePasswordVerificationCodeRequestDto = {
	/** 用户客户端使用的语言 */
	clientLanguage: string;
};

/**
 * 请求发送用户更改密码的验证码的请求响应
 */
export type RequestSendChangePasswordVerificationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 是否达到超时时间 */
	isCoolingDown: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户更改密码的请求的参数
 */
export type UpdateUserPasswordRequestDto = {
	/** 用户的旧密码 */
	oldPasswordHash: string;
	/** 用户的新邮箱 */
	newPasswordHash: string;
	/** 验证码 */
	verificationCode: string;
};

/**
 * 用户更改密码返回的参数
 */
export type UpdateUserPasswordResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 请求发送忘记密码的邮箱验证码的请求载荷
 */
export type RequestSendForgotPasswordVerificationCodeRequestDto = {
	/** 用户客户端使用的语言 */
	clientLanguage: string;
	/** 忘记密码的账户的邮箱 */
	email: string;
};

/**
 * 请求发送忘记密码的邮箱验证码的请求响应
 */
export type RequestSendForgotPasswordVerificationCodeResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 是否达到超时时间 */
	isCoolingDown: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 找回密码（更新密码）的请求载荷
 */
export type ForgotPasswordRequestDto = {
	/** 忘记密码的账户的邮箱 */
	email: string;
	/** 用户的新邮箱 */
	newPasswordHash: string;
	/** 验证码 */
	verificationCode: string;
};

/**
 * 找回密码（更新密码）的请求响应
 */
export type ForgotPasswordResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 检查用户名是否可用的请求载荷
 */
export type CheckUsernameRequestDto = {
	/** 用户名 */
	username: string;
};

/**
 * 检查用户名是否可用的请求响应
 */
export type CheckUsernameResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 是否是可用的用户名 */
	isAvailableUsername: boolean;
};

/**
 * 管理员获取所有被封禁用户信息的请求载荷
 */
export type GetBlockedUserRequestDto = {
	/** 排序字段 */
	sortBy: string;
	/** 排序方法 */
	sortOrder: string;
	/** 查询 UID */
	uid?: number;
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 管理员获取所有被封禁用户的信息的请求响应
 */
export type GetBlockedUserResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求响应，被封禁的用户 */
	result?: (
		GetUserInfoByUidResponseDto["result"] & {
			uid: number;
			UUID: string;
		}
	)[];
	/** 数据总长度 */
	totalCount: number;
};

/**
 * 管理员获取用户信息的请求载荷
 */
export type AdminGetUserInfoRequestDto = {
	/** 是否只展示在上一次审核通过后修改了用户信息的用户 */
	isOnlyShowUserInfoUpdatedAfterReview: boolean;
	/** 排序字段 */
	sortBy: string;
	/** 排序方法 */
	sortOrder: string;
	/** 查询 UID */
	uid?: number;
	/** 分页查询 */
	pagination: {
		/** 当前在第几页 */
		page: number;
		/** 一页显示多少条 */
		pageSize: number;
	};
};

/**
 * 管理员获取用户信息的请求响应
 */
export type AdminGetUserInfoResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求响应 */
	result?: (
		GetSelfUserInfoResponseDto["result"] & {
			uid: number;
			UUID: string;
			avatar: string;
			userBannerImage: string;
			editDateTime: number;
			editOperatorUUID: string;
			isUpdatedAfterReview: boolean;
		}
	)[];
	/** 数据总长度 */
	totalCount: number;
};

/**
 * 管理员通过用户信息审核的请求载荷
 */
export type ApproveUserInfoRequestDto = {
	/** 用户的 UUID */
	UUID: string;
};

/**
 * 管理员通过用户信息审核的请求响应
 */
export type ApproveUserInfoResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 管理员清空某个用户的信息的请求载荷
 */
export type AdminClearUserInfoRequestDto = {
	/** 用户的 UID */
	uid: number;
};

/**
 * 管理员清空某个用户的信息的请求响应
 */
export type AdminClearUserInfoResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 管理员编辑用户信息的请求载荷
 */
export type AdminEditUserInfoRequestDto = {
	/** 用户的 UID */
	uid: number;
	/** 编辑用户的信息 */
	userInfo?: {
		/** 用户名 */
		username?: string;
		/** 用户昵称 */
		userNickname?: string;
		/** 用户头像的链接 */
		avatar?: string;
		/** 用户背景图片的链接 */
		userBannerImage?: string;
		/** 用户的个性签名 */
		signature?: string;
		/** 用户的性别，男、女和自定义（字符串） */
		gender?: string;
		/** 用户生日 */
		userBirthday?: string;
		/** 用户主页 Markdown */
		userProfileMarkdown?: string;
		/** 审核状态 */
		isUpdatedAfterReview?: boolean;
	};
};

/**
 * 管理员编辑用户信息的请求响应
 */
export type AdminEditUserInfoResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 已登录用户通过密码和 TOTP 验证码删除身份验证器的请求载荷
 */
export type DeleteTotpAuthenticatorByTotpVerificationCodeRequestDto = {
	/** 用户的 TOTP 验证器中的验证码 */
	clientOtp: string;
	/** 被哈希一次的密码 */
	passwordHash: string;
};

/**
 * 已登录用户通过密码和邮箱验证码删除用户的身份验证器的请求响应
 */
export type DeleteTotpAuthenticatorByTotpVerificationCodeResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 是否正在冷却中 */
	isCoolingDown?: boolean;
};

/**
 * 用户创建 TOTP 身份验证器的请求响应
 */
export type CreateUserTotpAuthenticatorResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 身份验证器是否已存在 */
	isExists: boolean;
	/** 如果已存在，则返回验证器的类型 */
	existsAuthenticatorType?: "email" | "totp";
	/** TOTP 身份验证器信息 */
	result?: {
		/** TOTP 的唯一 ID，验证器的二维码 */
		otpAuth?: string;
	};
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户创建 Email 身份验证器的请求响应
 */
export type CreateUserEmailAuthenticatorResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 身份验证器是否已存在 */
	isExists: boolean;
	/** 如果已存在，则返回验证器的类型 */
	existsAuthenticatorType?: "email" | "totp";
	/** Email 身份验证器信息 */
	result?: {
		/** Email */
		email?: string;
		/** Email Lower Case */
		emailLowerCase?: string;
	};
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户确认绑定 TOTP 设备的请求载荷
 */
export type ConfirmUserTotpAuthenticatorRequestDto = {
	/** 用户设备中生成的 TOTP 验证码 */
	clientOtp: string;
	/** TOTP 的唯一 ID */
	otpAuth: string;
};

/**
 * 用户确认绑定 TOTP 设备的请求响应
 */
export type ConfirmUserTotpAuthenticatorResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 结果 */
	result?: {
		/** 验证器备份码 */
		backupCode?: string[];
		/** 验证器恢复码 */
		recoveryCode?: string;
	};
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户发送 Email 身份验证器验证邮件的请求载荷
 */
export type SendUserEmailAuthenticatorVerificationCodeRequestDto = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
	/** 用户客户端使用的语言 */
	clientLanguage: string;
};

/**
 * 用户发送 Email 身份验证器验证邮件的请求响应
 */
export type SendUserEmailAuthenticatorVerificationCodeResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 是否达到超时时间 */
	isCoolingDown: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户发送删除 Email 身份验证器验证邮件的请求载荷
 */
export type SendDeleteUserEmailAuthenticatorVerificationCodeRequestDto = {
	/** 用户客户端使用的语言 */
	clientLanguage: string;
};

/**
 * 用户发送删除 Email 身份验证器验证邮件的请求响应
 */
export type SendDeleteUserEmailAuthenticatorVerificationCodeResponseDto = {} & SendUserEmailAuthenticatorVerificationCodeResponseDto;

/**
 * 验证 Email 身份验证器的验证码是否正确的请求载荷
 */
export type CheckEmailAuthenticatorVerificationCodeRequestDto = {
	/** 用户的邮箱 */
	email: string;
	/** 邮箱验证码 */
	verificationCode: string;
};

/**
 * 验证 Email 身份验证器的验证码是否正确的请求响应
 */
export type CheckEmailAuthenticatorVerificationCodeResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 用户删除 Email 2FA 的请求载荷
 */
export type DeleteUserEmailAuthenticatorRequestDto = {
	/** 被哈希一次的密码 */
	passwordHash: string;
	/** 邮箱验证码 */
	verificationCode: string;
};

/**
 * 用户删除 Email 2FA 的请求响应
 */
export type DeleteUserEmailAuthenticatorResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 检查 2FA 是否开启的请求载荷
 */
export type CheckUserHave2FARequestDto = {
	/** 用户的邮箱 */
	email: string;
};

/**
 * 检查 2FA 是否开启的请求响应
 */
export type CheckUserHave2FAResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 是否存在身份验证器 */
	have2FA: boolean;
	/** 如果存在，则返回 2FA 的类型 */
	type?: "email" | "totp";
	/** 如果存在且结果为 totp，则返回 2FA 的创建时间 */
	totpCreationDateTime?: number;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 根据 UUID 校验用户是否存在的请求载荷
 */
export type CheckUserExistsByUuidRequestDto = {
	/** 用户的 UUID */
	uuid: string;
};

/**
 * 根据 UUID 校验用户是否存在的请求响应
 */
export type CheckUserExistsByUuidResponseDto = {
	/** 执行结果 */
	success: boolean;
	/** 用户是否已存在 */
	exists: boolean;
	/** 附加的文本消息 */
	message?: string;
};

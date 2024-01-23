/**
 * 用户注册提交的参数
 */
export type UserRegistrationRequestDto = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
	/** 密码提示 */
	passwordHint?: string;

	// // TODO 用户创建时间
	// /** 用户创建时间 */
	// userCreateDate: number;
}

/**
 * 用户注册的返回参数
 */
export type UserRegistrationResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户 ID */
	uid?: number;
	/** 如果注册成功，则返回一个 token，如果注册失败，则 token 是一个假值（undefined、null 或 ""） */
	token?: string;
	/** 附加的文本消息 */
	message?: string;
}

/**
 * 用户登录提交的参数
 */
export type UserLoginRequestDto = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
}

/**
 * 用户登录的返回参数
 */
export type UserLoginResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户邮箱 */
	email?: string;
	/** 用户 ID */
	uid?: number;
	/** 如果登录成功，则返回一个 token，如果登录失败，则 token 是一个假值（undefined、null 或 ""） */
	token?: string;
	/** 密码提示 */
	passwordHint?: string;
	/** 附加的文本消息 */
	message?: string;
}

/**
 * 验证用户邮箱是否存在提交的参数
 */
export type UserExistsCheckRequestDto = {
	/** 用户邮箱 */
	email: string;
}

/**
 * 验证用户邮箱是否已经存在的返回参数
 */
export type UserExistsCheckResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户存在或者查询失败（悲观）都会返回 true，不存在返回 false */
	exists: boolean; // WARN: 用户已存在或查询失败时都会返回 true
	/** 附加的文本消息 */
	message?: string;
}

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
}

/**
 * 用户更改邮箱返回的参数
 */
export type UpdateUserEmailResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
}

/**
 * 等待被 Hash 的密码和用户信息
 */
export type BeforeHashPasswordDataType = {
	/** 用户邮箱 */
	email: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
}



/**
 * 用户的个人标签
 */
export type UserLabel = {
	/** 标签 ID */
	id: number;
	/** 标签名 */
	labelName: string;
}

/**
 * 用户的关联账户
 */
export type UserLinkAccounts = {
	/** 关联账户类型 - 例："X" */
	accountType: string;
	/** 关联账户唯一标识 */
	accountUniqueId: string;
}

/**
 * 用户的关联网站
 */
export type UserWebsite = {
	/** 关联网站名 - 例："我的个人主页" */
	websiteName: string;
	/** 关联网站 URL */
	websiteUrl: string;
}

/**
 * 更新或创建用户信息时的请求参数
 */
export type UpdateOrCreateUserInfoRequestDto = {
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
	/** 用户的个人标签 */
	label?: UserLabel[];
	/** 用户生日 */
	userBirthday?: number;
	/** 用户主页 Markdown */
	userProfileMarkdown?: string;
	/** 用户的关联账户 */
	userLinkAccounts?: UserLinkAccounts[];
	/** 用户的关联网站 */
	userWebsite?: UserWebsite;
}


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
}



/**
 * 获取当前登录的用户信息的请求参数
 */
export type GetSelfUserInfoRequestDto = {
	/** 用户 ID */
	uid: number;
	/** 用户的身分令牌 */
	token: string;
}

/**
 * 获取当前登录的用户信息的请求响应
 */
export type GetSelfUserInfoResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
	/** 请求结果 */
	result?: { uid?: number } & UpdateOrCreateUserInfoRequestDto;
}

/**
 * 通过 UID 获取用户信息的请求载荷
 */
export type GetUserInfoByUidRequestDto = {
	/** 目标用户的 UID */
	uid: number;
}

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
	};
}

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
}

/**
 * 用户登出的响应
 */
export type UserLogoutResponseDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 附加的文本消息 */
	message?: string;
}

/**
 * 获取用于用户上传头像的预签名 URL, 上传限时 60 秒
 */
export type GetUserAvatarUploadSignedUrlResultDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用于用户上传头像的预签名 URL */
	userAvatarUploadSignedUrl?: string;
	/** 附加的文本消息 */
	message?: string;
}

/**
 * 用户关联账户的隐私设置
 */
type UserLinkAccountsPrivacySettingDto = {
	/** 关联账户类型 - 非空 - 例："X" */
	accountType: string;
	/** 显示方式 - 非空 - 允许的值有：{public: 公开, following: 仅关注, private: 隐藏} */
	privacyType: 'public' | 'following' | 'private';
}

/**
 * 基础用户个性设置类型
 */
export type BasicUserSettingsDto = {
	/** 是否启用 Cookie - 布尔 */
	enableCookie?: boolean;
	/** 主题外观设置（主题类型） - 可选的值：{light: 浅色, dark: 深色, system: 跟随系统} */
	themeType?: 'light' | 'dark' | 'system';
	/** 主题颜色 - 字符串，颜色字符串 */
	themeColor?: string;
	/** 壁纸（背景图 URL） - 字符串 */
	wallpaper?: string;
	/** 是否启用彩色导航栏 - 布尔 */
	coloredSideBar?: boolean;
	/** 节流模式 - 字符串，{standard: 标准, limit: 节流模式, preview: 超前加载} */
	dataSaverMode?: 'standard' | 'limit' | 'preview';
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
	/** 实验性：启用动态背景 - 布尔 */
	showCssDoodle?: boolean;
	/** 实验性：启用直角模式 - 布尔 */
	sharpAppearanceMode?: boolean;
	/** 实验性：启用扁平模式 - 布尔 */
	flatAppearanceMode?: boolean;
	/** 用户关联网站的隐私设置 - 允许的值有：{public: 公开, following: 仅关注, private: 隐藏} */
	userWebsitePrivacySetting?: 'public' | 'following' | 'private';
	/** 用户关联账户的隐私设置 */
	userLinkAccountsPrivacySetting?: UserLinkAccountsPrivacySettingDto[];
}

/**
 * 获取用于渲染页面的用户设定的请求参数
 */
export type GetUserSettingsRequestDto = {} & GetSelfUserInfoRequestDto

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
}


/**
 * 更新或创建用户设定的请求参数
 */
export type UpdateOrCreateUserSettingsRequestDto = {} & BasicUserSettingsDto

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
}

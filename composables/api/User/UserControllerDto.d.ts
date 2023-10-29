/**
 * 用户注册提交的参数
 */
export type UserRegistrationDataDto = {
	/** 用户名 */
	username: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
	/** 密码提示 */
	passwordHint?: string;
};

/**
 * 用户注册的返回参数
 */
export type UserRegistrationResultDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
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
export type UserLoginDataDto = {
	/** 用户名 */
	username: string;
	/** 在前端已经 Hash 过一次的的密码 */
	passwordHash: string;
};

/**
 * 用户登录的返回参数
 */
export type UserLoginResultDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户名 */
	username?: string;
	/** 用户 ID */
	uid?: number;
	/** 如果登录成功，则返回一个 token，如果登录失败，则 token 是一个假值（undefined、null 或 ''） */
	token?: string;
	/** 密码提示 */
	passwordHint?: string;
	/** 附加的文本消息 */
	message?: string;
};

/**
 * 验证用户是否存在提交的参数
 */
export type UserExistsCheckDataDto = {
	/** 用户名 */
	username: string;
};

/**
 * 验证用户是否已经存在的返回参数
 */
export type UserExistsCheckResultDto = {
	/** 执行结果，程序执行成功，返回 true，程序执行失败，返回 false */
	success: boolean;
	/** 用户存在或者查询失败（悲观）都会返回 true，不存在返回 false */
	exists: boolean; // WARN 注意：用户存在或查询失败时都会返回 true
	/** 附加的文本消息 */
	message?: string;
};

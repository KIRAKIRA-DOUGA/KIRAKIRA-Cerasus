/**
 * 用户注册提交的参数
 * @param username 用户名
 * @param passwordHash 在前端已经 Hash 过一次的的密码
 */
export type UserRegistrationDataDto = {
	username: string;
	passwordHash: string;
	passwordHint?: string;
};

/**
 * 用户注册返回的参数
 * @param success 执行结果，程序执行成功，返回 true，程序执行失败，返回 false
 * @param token 如果注册成功，则返回一个 token，如果注册失败，则 token 是一个假值（undefined、null 或 ''）
 * @param message 附加的文本消息
 */
export type UserRegistrationResultDto = {
	success: boolean;
	token?: string;
	message?: string;
};

/**
 * 用户登录提交的参数
 * @param username 用户名
 * @param passwordHash 在前端已经 Hash 过一次的的密码
 */
export type UserLoginDataDto = {
	username: string;
	passwordHash: string;
};

/**
 * 用户登录返回的参数
 * @param success 执行结果，程序执行成功，返回 true，程序执行失败，返回 false
 * @param token 如果登录成功，则返回一个 token，如果登录失败，则 token 是一个假值（undefined、null 或 ''）
 * @param message 附加的文本消息
 */
export type UserLoginResultDto = {
	success: boolean;
	username?: string;
	token?: string;
	passwordHint?: string;
	message?: string;
};

/**
 * 验证用户是否存在提交的参数
 * @param username 用户名
 */
export type UserExistsCheckDataDto = {
	username: string;
};

/**
 * 验证用户是否存在返回的参数
 * @param success 执行结果，程序执行成功，返回 true，程序执行失败，返回 false
 * @param exists 用户存在或者查询失败（悲观）都会返回 true，不存在返回 false // WARN 注意：用户存在和查询失败时都会返回 true
 * @param message 附加的文本消息
 */
export type UserExistsCheckResultDto = {
	success: boolean;
	exists: boolean;
	message?: string;
};

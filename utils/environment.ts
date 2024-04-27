/**
 * 环境宏定义变量。
 */
export const environment = {
	/** 是否是服务端渲染？ */
	get server() { return process.server; },
	/** 是否是客户端渲染？ */
	get client() { return process.client; },
	/** 是否是生产环境下？ */
	get production() { return process.env.NODE_ENV === "production"; },
	/** 是否是开发环境下？ */
	get development() { return process.env.NODE_ENV === "development"; },
	/** 是否使用本地运行的后端环境进行开发？ */
	get localBackend() {
		try {
			return import.meta.env.VITE_BACKEND_PROVIDER === "localhost";
		} catch (error) {
			console.error("ERROR", "ERROR in environment.localBackend: ", error);
			return false;
		}
	},
};

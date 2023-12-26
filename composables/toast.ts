/**
 * 消息框消息事件。
 */
export interface ToastEvent {
	/** 消息文本。 */
	message: string;
	/** 事件级别，即确定图标和颜色。 */
	severity: "success" | "warning" | "error" | "info";
	/** 消息显示的时间。 */
	duration?: number;
}

/**
 * 发送消息到消息框。
 * @param message - 消息文本。
 * @param severity - 事件级别，即确定图标和颜色。
 * @param duration - 消息显示的时间（单位：毫秒）。
 */
export function useToast(message: string, severity: ToastEvent["severity"] = "success", duration?: number) {
	useEvent("app:toast", { message, severity, duration });
}

/**
 * 清空消息框列表的所有内容。
 */
export function clearAllToast() {
	useEvent("app:clearAllToast");
}

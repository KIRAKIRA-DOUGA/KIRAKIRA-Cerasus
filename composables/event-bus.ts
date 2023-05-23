import mitt from "mitt";
import { TooltipEvent } from "plugins/vue/tooltip";
import { ToastEvent } from "./toast";

type ApplicationEvents = {
	// 在此处定义需要全局使用的事件。
	"app:requestLogin": void;
	"app:toast": ToastEvent;
	"app:showTooltip": TooltipEvent;
	"app:hideTooltip": HTMLElement;
	"app:updateTooltip": TooltipEvent;
	"user:login": boolean;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;

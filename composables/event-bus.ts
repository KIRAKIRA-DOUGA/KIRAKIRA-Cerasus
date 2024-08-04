import mitt from "mitt";
import type { TooltipEvent, VTooltipBindingValue } from "plugins/vue/tooltip";
import type { ToastEvent } from "./toast";

type ApplicationEvents = {
	// 在此处定义需要全局使用的事件。
	"app:requestLogin": void;
	"app:toast": ToastEvent;
	"app:clearAllToast": void;
	"app:showDrawer": void;
	"component:showTooltip": TooltipEvent;
	"component:hideTooltip": HTMLElement;
	"component:updateTooltip": TooltipEvent;
	"component:refreshTooltip": WeakMap<HTMLElement, { value: VTooltipBindingValue; symbol: symbol }>;
	"component:hideAllPlayerVideoMenu": void;
	"component:hideAllContextualToolbar": void;
	"user:login": boolean;
	"videoComment:emitVideoComment": VideoCommentResult;
	"videoComment:deleteVideoComment": string;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;

import mitt from "mitt";
import { TooltipEvent, VTooltipBindingValue } from "plugins/vue/tooltip";
import { ToastEvent } from "./toast";

type ApplicationEvents = {
	// 在此处定义需要全局使用的事件。
	"app:requestLogin": void;
	"app:toast": ToastEvent;
	"app:showDrawer": void;
	"component:showTooltip": TooltipEvent;
	"component:hideTooltip": HTMLElement;
	"component:updateTooltip": TooltipEvent;
	"component:refreshTooltip": WeakMap<HTMLElement, { value: VTooltipBindingValue; symbol: symbol }>;
	"component:hideAllPlayerVideoMenu": void;
	"component:hideAllContextualToolbar": void;
	"user:login": boolean;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;

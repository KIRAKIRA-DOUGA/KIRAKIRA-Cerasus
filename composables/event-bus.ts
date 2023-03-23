import mitt from "mitt";
import { ToastEvent } from "./toast";

type ApplicationEvents = {
	// 在此处定义需要全局使用的事件。
	"app:requestLogin": void;
	"app:toast": ToastEvent;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;

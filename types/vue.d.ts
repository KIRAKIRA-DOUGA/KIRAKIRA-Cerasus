import type { Hookable } from "hookable";
import { NitroApp as OriginalNitroApp } from "ninode_modules/nitropack/dist/runtime/apptropack";
export { };

declare module "node_modules/nitropack/dist/runtime/app" {
	type HtmlContext = Record<"body" | "bodyAppend" | "bodyAttrs" | "bodyPrepend" | "head" | "htmlAttrs", string[]>;
	type HookResult = Promise<void> | void;

	export interface NitroApp extends Omit<OriginalNitroApp, "hooks"> {
		nitro: Hookable<{
			"render:html": (html: HtmlContext) => HookResult;
		}>;
		// hooks: Hookable<Record<string, HookCallback>, string>;
	}

}

declare module "vue" {
	export interface GlobalComponents {
		/**
		 * KIRAKIRA 组件，KIRA 人自己的组件。
		 */
		"kira-component": typeof HTMLElement;
	}
}

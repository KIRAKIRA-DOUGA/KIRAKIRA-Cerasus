import type { Hookable } from "hookable";
import { NitroApp as OriginalNitroApp } from "node_modules/nitropack/dist/runtime/app";
import { NuxtRenderHTMLContext, NuxtRenderResponse } from "node_modules/nuxt/dist/core/runtime/nitro/renderer";
type EventHandler = ReturnType<typeof eventHandler>;
type EventParam = { event: EventHandler };
type HookResult = Promise<void> | void;
type DefineNitroPlugin = (def: NitroAppPlugin) => NitroAppPlugin;

export declare const defineNitroPlugin: DefineNitroPlugin;
export interface NitroAppPlugin {
	(nitro: NitroApp): void;
}

export type NitroHooks = Hookable<{
	/** 在发送响应之前调用。 */
	"render:response": (response: NuxtRenderResponse, { event }: EventParam) => HookResult;
	/** 在构造 HTML 之前调用。 */
	"render:html": (html: NuxtRenderHTMLContext, { event }: EventParam) => HookResult;
}>;

export interface NitroApp extends Omit<OriginalNitroApp, "hooks"> {
	hooks: NitroHooks;
	// hooks: Hookable<Record<string, HookCallback>, string>;
}

declare global { // Doesn't work.
	export declare const defineNitroPlugin: DefineNitroPlugin;
}

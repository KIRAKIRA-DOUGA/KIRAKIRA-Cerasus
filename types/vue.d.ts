import * as _vueRouter from "#vue-router";
import * as _lottieWeb from "lottie-web";
import * as _nuxt_app from "nuxt/app";
import { VTooltipBindingValue } from "plugins/vue/tooltip";
import { AllowedComponentProps, DirectiveBinding } from "vue";
import CSSDoodle from "./css-doodle";

type EventHandlers<E> = {
	[K in keyof E]?: E[K] extends (...args: Any) => Any ? E[K] : (payload: E[K]) => void;
};

declare module "vue" {
	/**
	 * 在此处声明自定义 HTML 标签。
	 */
	export interface GlobalComponents {
		/**
		 * KIRAKIRA 组件，KIRA 人自己的组件。
		 */
		"kira-component": JSX.IntrinsicElements["section"];
		"css-doodle": CSSDoodle;
	}

	/**
	 * 在此处声明自定义 HTML 属性。
	 */
	export interface HTMLAttributes {
		"v-ripple"?: boolean;
		"v-i"?: number;
		"v-tooltip"?: VTooltipBindingValue;
	}

	export interface ComponentOptionsBase {
		__scopeId?: string;
	}

	export interface AllowedComponentProps extends HTMLAttributes { // Exclude<HTMLAttributes, EventHandlers<Events>> {
		lang?: string;
		title?: Readable;
		tabindex?: Numberish;
		hidden?: Booleanish;
		// onClick?: (payload: MouseEvent) => void;
	}
}

declare module "#app" { // Doesn't work.
	interface PageMeta {
		slug?: string[];
		next?: string;
		setting?: string;
		error?: string;
		uid?: number;
		kvid?: number;
	}
}

declare global {
	/**
	 * Vue JSX 组件。
	 * @template Props - 声明组件属性。
	 * @template Emits - 声明组件事件。
	 * @template Slots - 声明组件插槽。
	 */
	export type VueJsx<
		Props = {},
		Emits = {},
		Slots extends Partial<Record<string, Slot>> = { default: Slot },
	> = (
		/** 组件属性。 */
		props: Props & AllowedComponentProps,
		/** 组件上下文信息。 */
		context: {
			/** 组件特性。 */
			attrs: Record<string, string>;
			/** 组件插槽。 */
			slots: Slots;
			/** 组件事件。 */
			emit: Emits;
			/** 组件暴露对象。 */
			expose: (exposed?: Record<string, unknown>) => void;
		}
	) => JSX.Element;

	type DirectiveEffectHookInferElement<D extends Directive> = D extends Directive<infer T> ? T : HTMLElement;
	type DirectiveEffectHookInferBinding<D extends Directive> = D extends Directive<Any, infer T> ? T : never;
	export type DirectiveEffectHook<D extends Directive, T = void> = (element: DirectiveEffectHookInferElement<D>, binding: DirectiveBinding<DirectiveEffectHookInferBinding<D>>) => T;

	export type LayoutKey = PageMeta["layout"];

	export { RouteLocation } from "#vue-router";
	export { Editor } from "@tiptap/vue-3";
	export { AnimationItem } from "lottie-web";
	export { PageMeta } from "nuxt/app";
	export { CSSProperties, ComponentInternalInstance, ConcreteComponent, Directive, DirectiveBinding, Events, MaybeRef, MaybeRefOrGetter, Ref, RendererElement, RendererNode, ShallowRef, Slot, Slots, StyleValue, UnwrapRef, VNode, VNodeArrayChildren, VNodeProps, WritableComputedRef } from "vue";
}

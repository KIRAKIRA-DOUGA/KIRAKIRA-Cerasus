import * as components from "#components";
import { Directive } from "vue";

declare module "vue" {
	/**
	 * 在此处声明自定义 HTML 标签。
	 */
	export interface GlobalComponents {
		/**
		 * KIRAKIRA 组件，KIRA 人自己的组件。
		 */
		"kira-component": typeof HTMLElement;
		"css-doodle": typeof HTMLElement;
	}

	/**
	 * 在此处声明自定义 HTML 属性。
	 */
	export interface HTMLAttributes {
		// "ripple": boolean;
	}
}

declare global { // Doesn't work.
	// const vRipple: Directive<HTMLElement>;
}

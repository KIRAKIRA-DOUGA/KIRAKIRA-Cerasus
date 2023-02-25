// import { Directive } from "vue";
import CSSDoodle from "./css-doodle";

declare module "vue" {
	/**
	 * 在此处声明自定义 HTML 标签。
	 */
	export interface GlobalComponents {
		/**
		 * KIRAKIRA 组件，KIRA 人自己的组件。
		 */
		"kira-component": typeof HTMLElement;
		"css-doodle": CSSDoodle;
	}

	/**
	 * 在此处声明自定义 HTML 属性。
	 */
	export interface HTMLAttributes {
		"v-ripple"?: boolean;
		"v-i"?: number;
	}
}

declare global {
	export * from "#components"; // Is it worked?
}

export { };

declare module "vue" {
	export interface GlobalComponents {
		/**
		 * KIRAKIRA 组件，KIRA 人自己的组件。
		 */
		"kira-component": typeof HTMLElement;
	}
}

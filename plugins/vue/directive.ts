/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DirectiveBinding, VNode } from "nuxt/dist/app/compat/capi";

const getSSRProps = (binding: DirectiveBinding, vnode: VNode) => {
	// you can provide SSR-specific props here
	return {};
};

export default defineNuxtPlugin(nuxt => {
	nuxt.vueApp.directive("focus", {
		mounted(el: HTMLElement) {
			el.focus();
		},
		getSSRProps,
	});

	nuxt.vueApp.directive("drag", {
		// 1.指令绑定到元素上回立刻执行bind(改名为beforeMount)函数，只执行一次
		// 2.每个函数中第一个参数永远是el，表示绑定指令的元素，el参数是原生js对象
		// 3.通过el.focus()是无法获取焦点的，因为只有插入DOM后才生效
		// inserted(改名为mounted)表示一个元素，插入到DOM中会执行inserted函数，只触发一次
		mounted(el: HTMLElement) {
			const odiv = el; // 获取当前元素
			let firstTime: number, lastTime: number;
			el.onmousedown = function (e) {
				const disx = e.pageX - el.offsetLeft;
				const disy = e.pageY - el.offsetTop;
				// 给当前元素添加属性，用于元素状态的判断
				odiv.setAttribute("ele-flag", "false");
				odiv.setAttribute("draging-flag", "true");
				firstTime = new Date().getTime();
				document.onmousemove = function (e) {
					el.style.left = `${e.pageX - disx}px`;
					el.style.top = `${e.pageY - disy}px`;
				};
				document.onmouseup = function (event) {
					document.onmousemove = document.onmouseup = null;
					lastTime = new Date().getTime();
					if ((lastTime - firstTime) > 200) {
						odiv.setAttribute("ele-flag", "true");
						event.stopPropagation();
					}
					setTimeout(function () {
						odiv.setAttribute("draging-flag", "false");
					}, 100);
				};
			};
		},
		getSSRProps,
	});
});

/**
 * Vue 2:
 * bind - 指令绑定到元素后发生。只发生一次。
 * inserted - 元素插入父 DOM 后发生。
 * update - 当元素更新，但子元素尚未更新时，将调用此钩子。
 * componentUpdated - 一旦组件和子级被更新，就会调用这个钩子。
 * unbind - 一旦指令被移除，就会调用这个钩子。也只调用一次。
 *
 * Vue 3:
 * bind → beforeMount
 * inserted → mounted
 * beforeUpdate：新的！这是在元素本身更新之前调用的，很像组件生命周期钩子。
 * componentUpdated → updated
 * beforeUnmount：新的！与组件生命周期钩子类似，它将在卸载元素之前调用。
 * unbind → unmounted
 */

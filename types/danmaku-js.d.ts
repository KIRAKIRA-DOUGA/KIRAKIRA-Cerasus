// 补充 Danmaku.js 的 DOM 或 Canvas 引擎的独立版本的类型声明

declare module "danmaku/dist/esm/danmaku.dom.js" {
	import Danmaku from "danmaku";
	export default Danmaku;
}

declare module "danmaku/dist/esm/danmaku.canvas.js" {
	import Danmaku from "danmaku";
	export default Danmaku;
}

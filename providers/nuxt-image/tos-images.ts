import { defineProvider } from "@nuxt/image/runtime";
import { joinURL } from "ufo";
import type { ProviderGetImage } from "./types";

// 火山引擎 TOS 图片 provider。
// 图片在上传确认时已由后端用 TOS「另存为」预生成多分辨率变体（命名为 `{原key}.w{N}.webp`），
// 这里只做「请求宽度 → 变体档位」的映射，读取路径零实时处理，从而绕开 TOS 图片处理的并发上限。
// 档位须与后端 KIRAKIRA-Rosales src/volcengine/index.ts 的 tosImageVariants 保持一致。

/** 预生成的变体宽度档位（升序）。 */
const VARIANT_WIDTHS = [32, 200, 640, 1280];

/** 模糊占位图档位（该档生成时已预模糊，用于渐进加载的第一帧）。 */
const PLACEHOLDER_WIDTH = 32;

const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = "" } = {}) => {
	const { width, height, dpr, blur } = modifiers as Record<string, unknown>;

	// src 可能是 TOS 对象名（key，数据库存法）或完整 URL（旧数据），变体后缀直接拼在其后。
	const target = /^https?:\/\//i.test(src) ? src : joinURL(baseURL, src);

	// 需要模糊效果时直接用预模糊的最小档。
	if (Number(blur) > 0)
		return { url: `${target}.w${PLACEHOLDER_WIDTH}.webp`, format: "webp" };

	// 高分屏时按 dpr 放大请求像素；未指定尺寸或超过最大档位时返回原图（如下载原图场景）。
	const scale = Number(dpr) > 0 ? Number(dpr) : 1;
	const requested = Math.round(Number(width || height || 0) * scale);
	if (!requested)
		return { url: target };

	const variant = VARIANT_WIDTHS.find(w => w >= requested);
	if (!variant)
		return { url: target };

	return { url: `${target}.w${variant}.webp`, format: "webp" };
};

export default defineProvider({
	getImage,
});

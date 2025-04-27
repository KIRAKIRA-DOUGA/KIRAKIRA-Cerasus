/**
 * 根据传入的 `videoId` 和 `nuxt.config.ts` 中配置的 *Cloudflare MPD 视频清单 URL 模板* 生成 Cloudflare MPD 视频清单 URL。
 * @param videoId - 视频 ID。
 * @returns Cloudflare MPD 视频清单 URL。
 */
export function getCloudflareMpdVideoUrl(videoId: string): string {
	const cloudflareMpdVideoUrlTemplate = environment.cloudflareStreamVideoMpdUrlTemplate;
	if (videoId && typeof cloudflareMpdVideoUrlTemplate === "string" && cloudflareMpdVideoUrlTemplate)
		try {
			return cloudflareMpdVideoUrlTemplate.replace("{videoId}", videoId);
		} catch (error) {
			useToast(t.toast.video_manifest_file_generate_failed, "error");
			console.error("ERROR", "生成视频清单文件时出错，ERROR:  ！", error);
			return "";
		}
	else {
		useToast(t.toast.video_manifest_file_generate_failed, "error");
		console.error("ERROR", "生成视频清单文件失败，必要参数为空，template: ！", cloudflareMpdVideoUrlTemplate);
		return "";
	}
}

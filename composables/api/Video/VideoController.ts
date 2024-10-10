import getCorrectUri from "api/Common/getCorrectUri";
import * as tus from "tus-js-client";
import { GET, POST, DELETE, uploadFile2CloudflareImages } from "../Common";
import type { ApprovePendingReviewVideoRequestDto, ApprovePendingReviewVideoResponseDto, DeleteVideoRequestDto, DeleteVideoResponseDto, GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, GetVideoCoverUploadSignedUrlResponseDto, PendingReviewVideoResponseDto, SearchVideoByVideoTagIdRequestDto, SearchVideoByVideoTagIdResponseDto, ThumbVideoResponseDto, UploadVideoRequestDto, UploadVideoResponseDto } from "./VideoControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_API_URL = `${BACK_END_URL}/video`;

/**
 * 获取主页中显示的视频
 * @returns 展示视频卡片需要的返回参数
 */
export const getHomePageThumbVideo = async (): Promise<ThumbVideoResponseDto> => {
	const { data: result } = await useFetch<ThumbVideoResponseDto>(`${VIDEO_API_URL}/home`);
	if (result.value)
		return result.value;
	else
		return { success: false, videosCount: 0, videos: [], message: "获取首页视频失败" };
};

/**
 * 根据视频 ID (KVID) 获取视频的数据
 * @param getVideoByKvidRequest 从视频 ID 获取视频的请求参数
 * @returns 视频页面需要的响应
 */
export const getVideoByKvid = async (getVideoByKvidRequest: GetVideoByKvidRequestDto): Promise<GetVideoByKvidResponseDto> => {
	if (getVideoByKvidRequest && getVideoByKvidRequest.videoId) {
		const { data: result } = await useFetch<GetVideoByKvidResponseDto>(`${VIDEO_API_URL}?videoId=${getVideoByKvidRequest.videoId}`, { credentials: "include" });
		if (result.value)
			return result.value;
		else
			return { success: false, message: "获取视频失败" };
	} else
		return { success: false, message: "未提供 KVID" };
};

/**
 * 根据 UID 获取该用户上传的视频
 * @param getVideoByUidRequest 根据 UID 获取该用户上传的视频的请求参数
 * @returns 根据 UID 获取该用户上传的视频的请求响应结果
 */
export const getVideoByUid = async (getVideoByUidRequest: GetVideoByUidRequestDto): Promise<GetVideoByUidResponseDto> => {
	if (getVideoByUidRequest && getVideoByUidRequest.uid) {
		const { data: result } = await useFetch<GetVideoByUidResponseDto>(`${VIDEO_API_URL}/user?uid=${getVideoByUidRequest.uid}`);
		if (result.value)
			return result.value;
		else
			return { success: false, message: "获取用户上传的视频失败", videosCount: 0, videos: [] };
	} else
		return { success: false, message: "未提供 UID", videosCount: 0, videos: [] };
};

/**
 * 根据关键字搜索视频
 * @param searchVideoByKeywordRequest 根据关键字搜索视频的请求参数
 * @returns 根据关键字搜索视频的请求响应结果
 */
export const searchVideoByKeyword = async (searchVideoByKeywordRequest: SearchVideoByKeywordRequestDto): Promise<SearchVideoByKeywordResponseDto> => {
	if (searchVideoByKeywordRequest && searchVideoByKeywordRequest.keyword) {
		const { data: result } = await useFetch<SearchVideoByKeywordResponseDto>(`${VIDEO_API_URL}/search?keyword=${searchVideoByKeywordRequest.keyword}`);
		if (result.value)
			return result.value;
		else
			return { success: false, message: "根据关键字搜索视频失败", videosCount: 0, videos: [] };
	} else
		return { success: false, message: "未提供关键字", videosCount: 0, videos: [] };
};

/**
 * 根据 TAG ID 列表搜索视频
 * @param searchVideoByVideoTagIdRequest 根据 TAG ID 列表搜索视频的请求参数
 * @returns 根据 TAG ID 列表搜索视频的请求响应结果
 */
export const searchVideoByTagIds = async (searchVideoByVideoTagIdRequest: SearchVideoByVideoTagIdRequestDto): Promise<SearchVideoByVideoTagIdResponseDto> => {
	if (searchVideoByVideoTagIdRequest && searchVideoByVideoTagIdRequest.tagId) {
		const { data: result } = await useFetch<SearchVideoByVideoTagIdResponseDto>(`${VIDEO_API_URL}/search/tag`, {
			method: "POST",
			body: { tagId: searchVideoByVideoTagIdRequest.tagId },
		});
		if (result.value)
			return result.value;
		else
			return { success: false, message: "根据 TAG ID 搜索视频失败", videosCount: 0, videos: [] };
	} else
		return { success: false, message: "未提供 TAG ID", videosCount: 0, videos: [] };
};

/**
 * TUS 上传一个文件
 */
export class TusFileUploader {
	step: "pending" | "created" | "uploading" | "pausing" | "success" | "error" = "pending";
	process: Promise<string>;
	uploading?: tus.Upload;
	isUploadingVideo: Ref<boolean>;

	/**
	 * TUS 上传一个文件
	 * @param file - 文件
	 * @param progress - 进度（Vue 响应式状态）
	 * @param isUploadingVideo - 是否正在上传视频（Vue 响应式状态）
	 */
	constructor(file: File, progress: Ref<number>, isUploadingVideo: Ref<boolean>) {
		if (!file) {
			this.step = "error";
			useToast("无法上传：未找到文件", "error"); // TODO: 使用多语言
			throw new Error("无法上传：未找到文件"); // TODO: 使用多语言
		}
		this.isUploadingVideo = isUploadingVideo;
		this.process = new Promise<string>((resolve, reject) => {
			let videoId = "";
			// Create a new tus upload
			const uploader = new tus.Upload(file, {
				endpoint: `${VIDEO_API_URL}/tus`,
				onBeforeRequest(req) {
					const url = req.getURL();
					if (url?.includes(VIDEO_API_URL)) { // 仅在请求后端 API 获取上传目的地 URL 时设置允许跨域传递 cookie，
						const xhr = req.getUnderlyingObject();
						xhr.withCredentials = true;
					}
				},
				retryDelays: [0, 3000, 5000, 10000, 20000], // 重试超时
				chunkSize: 52428800, // 视频分片大小
				storeFingerprintForResuming: true, // 存储用于恢复上传的 key // WARN: 正常运行时，应该为 True
				removeFingerprintOnSuccess: true, // 上传成功后移除用于恢复上传的 key
				metadata: {
					name: file.name,
					maxDurationSeconds: "1800", // 最大视频长度，1800 秒（30 分钟）
					expiry: getCloudflareRFC3339ExpiryDateTime(3600), // 最大上传耗时，3600 秒（1 小时）
				},
				onError: error => {
					console.error("ERROR", "Upload error: ", error);
					this.step = "error";
					reject(error);
				},
				onProgress: (bytesUploaded, bytesTotal) => {
					const percentage = bytesUploaded / bytesTotal * 100;
					progress.value = percentage;
					console.log(bytesUploaded, bytesTotal, percentage.toFixed(2) + "%"); // DELETE ME
				},
				onSuccess: () => {
					console.log("Download %s from %s", (uploader.file as File)?.name, uploader.url); // DELETE ME
					if (videoId) {
						this.step = "success";
						resolve(videoId);
					} else
						reject(new Error("Can not find the video ID"));
				},
				onAfterResponse: (req, res) => {
					if (!req.getURL().includes(VIDEO_API_URL)) {
						const headerVideoId = res?.getHeader("stream-media-id");
						if (headerVideoId)
							videoId = headerVideoId;
					}
				},
			});
			this.uploading = uploader;
			this.step = "created";
			// Check if there are any previous uploads to continue.
			uploader.findPreviousUploads().then(previousUploads => {
				// Found previous uploads so we select the first one.
				if (previousUploads.length)
					uploader.resumeFromPreviousUpload(previousUploads[0]);

				// Start the upload
				uploader.start();
				this.step = "uploading";
				isUploadingVideo.value = true;
			});
		});
	}

	/**
	 * 暂停 TUS 上传
	 */
	abort() {
		if (this.uploading)
			if (this.step === "uploading") {
				this.uploading.abort();
				this.step = "pausing";
				this.isUploadingVideo.value = false;
			} else
				console.error(`Upload pause failed, Pausing can only work when in 'uploading' step, but you are in '${this.step}' step.`); // TODO: 使用多语言
	}

	/**
	 * 恢复 TUS 上传
	 */
	resume() {
		if (this.uploading)
			if (this.step === "pausing") {
				this.uploading.start();
				this.step = "uploading";
				this.isUploadingVideo.value = true;
			} else
				console.error(`Upload resume failed, Uploading can only work when in 'pausing' step, but you are in '${this.step}' step.`); // TODO: 使用多语言
	}
}

/**
 * 获取用于上传视频封面图的预签名 URL, 上传限时 60 秒
 * @returns 用于上传视频封面图的预签名 URL 请求响应
 */
export async function getVideoCoverUploadSignedUrl(): Promise<GetVideoCoverUploadSignedUrlResponseDto> {
	return (await GET(`${VIDEO_API_URL}/cover/preUpload`, { credentials: "include" })) as GetVideoCoverUploadSignedUrlResponseDto;
}

/**
 * 通过预签名 URL 上传视频封面图
 * @param fileName 头像文件名
 * @param videoCoverBlobData 用 Blob 编码的用户头像文件
 * @param signedUrl 预签名 URL
 * @returns boolean 上传结果
 */
export async function uploadVideoCover(fileName: string, videoCoverBlobData: Blob, signedUrl: string): Promise<boolean> {
	try {
		await uploadFile2CloudflareImages(fileName, signedUrl, videoCoverBlobData, 60000);
		return true;
	} catch (error) {
		console.error("视频封面上传失败，错误信息：", error, { videoCoverBlobData, signedUrl });
		return false;
	}
}

/**
 * 提交已上传完成的视频
 * @param uploadVideoRequest 视频数据
 * @returns 上传视频的请求响应
 */
export async function commitVideo(uploadVideoRequest: UploadVideoRequestDto): Promise<UploadVideoResponseDto> {
	return await POST(`${VIDEO_API_URL}/upload`, uploadVideoRequest, { credentials: "include" }) as UploadVideoResponseDto;
}

/**
 * 删除一个视频
 * @param deleteVideoRequest 删除一个视频的请求载荷
 * @returns 删除一个视频的请求响应
 */
export async function deleteVideo(deleteVideoRequest: DeleteVideoRequestDto): Promise<DeleteVideoResponseDto> {
	return await DELETE(`${VIDEO_API_URL}/delete`, deleteVideoRequest, { credentials: "include" }) as DeleteVideoResponseDto;
}

/**
 * 获取待审核视频列表
 * @param headerCookie  从客户端发起 SSR 请求时传递的 Header 中的 Cookie 部分，在 SSR 时将其转交给后端 API
 * @returns 获取待审核视频列表的请求响应
 */
export const getPendingReviewVideo = async (headerCookie: { cookie?: string | undefined }): Promise<PendingReviewVideoResponseDto> => {
	// NOTE: use { headers: headerCookie } to passing client-side cookies to backend API when SSR.
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	const { data: result } = await useFetch(`${VIDEO_API_URL}/pending`, { headers: headerCookie, credentials: "include" });
	return result.value as PendingReviewVideoResponseDto;
};

/**
 * 通过一个待审核视频
 * @param approvePendingReviewVideoRequest 通过一个待审核视频的请求载荷
 * @returns 通过一个待审核视频的请求响应
 */
export async function approvePendingReviewVideo(approvePendingReviewVideoRequest: ApprovePendingReviewVideoRequestDto): Promise<ApprovePendingReviewVideoResponseDto> {
	return await POST(`${VIDEO_API_URL}/pending/approved`, approvePendingReviewVideoRequest, { credentials: "include" }) as ApprovePendingReviewVideoResponseDto;
}

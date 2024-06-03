import getCorrectUri from "api/Common/getCorrectUri";
import type { GetVideoByKvidRequestDto, GetVideoByKvidResponseDto, GetVideoByUidRequestDto, GetVideoByUidResponseDto, GetVideoCoverUploadSignedUrlResponseDto, SearchVideoByVideoTagIdRequestDto, SearchVideoByVideoTagIdResponseDto, ThumbVideoResponseDto, UploadVideoRequestDto, UploadVideoResponseDto } from "./VideoControllerDto";
import * as tus from "tus-js-client";
import { GET, POST, uploadFile2CloudflareImages } from "../Common";

const BACK_END_URL = getCorrectUri();
const VIDEO_API_URI = `${BACK_END_URL}/video`;

/**
 * 获取主页中显示的视频
 * @returns 展示视频卡片需要的返回参数
 */
export const getHomePageThumbVideo = async (): Promise<ThumbVideoResponseDto> => {
	const { data: result } = await useFetch<ThumbVideoResponseDto>(`${VIDEO_API_URI}/home`);
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
		const { data: result } = await useFetch<GetVideoByKvidResponseDto>(`${VIDEO_API_URI}?videoId=${getVideoByKvidRequest.videoId}`);
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
		const { data: result } = await useFetch<GetVideoByUidResponseDto>(`${VIDEO_API_URI}/user?uid=${getVideoByUidRequest.uid}`);
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
		const { data: result } = await useFetch<SearchVideoByKeywordResponseDto>(`${VIDEO_API_URI}/search?keyword=${searchVideoByKeywordRequest.keyword}`);
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
		const { data: result } = await useFetch<SearchVideoByVideoTagIdResponseDto>(`${VIDEO_API_URI}/search/tag`, {
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
 * @param file - 文件
 * @param progress - 进度
 * @returns Promise<string> 视频 ID
 */
export function tusFile(file: File, progress: Ref<number>) {
	if (!file) {
		useToast("无法上传：未找到文件", "error"); // TODO: 使用多语言
		return;
	}

	return new Promise<string>((resolve, reject) => {
		let videoId = "";
		// Create a new tus upload
		const upload = new tus.Upload(file, {
			endpoint: `${VIDEO_API_URI}/tus`,
			onBeforeRequest(req) {
				const url = req.getURL();
				if (!url?.includes("https://upload.videodelivery.net/tus")) { // 仅在请求后端 API 获取上传目的地 URL 时设置允许跨域传递 cookie，
					const xhr = req.getUnderlyingObject();
					xhr.withCredentials = true;
				}
			},
			retryDelays: [0, 3000, 5000, 10000, 20000], // 重试超时
			chunkSize: 52428800, // 视频分片大小
			storeFingerprintForResuming: false, // 存储用于恢复上传的 key
			removeFingerprintOnSuccess: true, // 上传成功后移除用于恢复上传的 key
			metadata: {
				name: file.name,
				maxDurationSeconds: "1800", // 最大视频长度，1800 秒（30 分钟）
				expiry: getCloudflareRFC3339ExpiryDateTime(3600), // 最大上传耗时，3600 秒（1 小时）
			},
			onError(error) {
				console.error("ERROR", "Upload error: ", error);
				reject(error);
			},
			onProgress(bytesUploaded, bytesTotal) {
				const percentage = bytesUploaded / bytesTotal * 100;
				progress.value = percentage;
				console.log(bytesUploaded, bytesTotal, percentage.toFixed(2) + "%"); // DELETE ME
			},
			onSuccess() {
				console.log("Download %s from %s", (upload.file as File)?.name, upload.url); // DELETE ME
				if (videoId)
					resolve(videoId);
				else
					reject(new Error("Can not find the video ID"));
			},
			onAfterResponse(req, res) {
				if (req.getURL().includes("https://upload.videodelivery.net/tus")) {
					const headerVideoId = res?.getHeader("stream-media-id");
					if (headerVideoId)
						videoId = headerVideoId;
				}
			},
		});

		// Check if there are any previous uploads to continue.
		upload.findPreviousUploads().then(function (previousUploads) {
			// Found previous uploads so we select the first one.
			if (previousUploads.length)
				upload.resumeFromPreviousUpload(previousUploads[0]);

			// Start the upload
			upload.start();
		});
	});
}

/**
 * 获取用于上传视频封面图的预签名 URL, 上传限时 60 秒
 * @returns 用于上传视频封面图的预签名 URL 请求响应
 */
export async function getVideoCoverUploadSignedUrl(): Promise<GetVideoCoverUploadSignedUrlResponseDto> {
	return (await GET(`${VIDEO_API_URI}/cover/preUpload`, { credentials: "include" })) as GetVideoCoverUploadSignedUrlResponseDto;
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
	return await POST(`${VIDEO_API_URI}/upload`, uploadVideoRequest, { credentials: "include" }) as UploadVideoResponseDto;
}

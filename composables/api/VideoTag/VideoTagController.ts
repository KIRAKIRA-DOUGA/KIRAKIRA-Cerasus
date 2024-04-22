import { GET, POST } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { CreateVideoTagResponseDto, SearchVideoTagRequestDto, SearchVideoTagResponseDto } from "./VideoTagControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_TAG_API_URI = `${BACK_END_URL}/video/tag`;

/**
 * 创建视频 TAG
 * @param createVideoTagRequest 视频 TAG 数据
 * @returns 创建视频 TAG 的请求响应
 */
export async function createVideoTag(createVideoTagRequest: CreateVideoTagRequestDto): Promise<CreateVideoTagResponseDto> {
	return await POST(`${VIDEO_TAG_API_URI}/create`, createVideoTagRequest, { credentials: "include" }) as CreateVideoTagResponseDto;
}

/**
 * 搜索视频 TAG
 * @param searchVideoTagRequest 搜索视频的请求载荷
 * @returns 搜索视频的请求响应
 */
export async function searchVideoTag(searchVideoTagRequest: SearchVideoTagRequestDto): Promise<SearchVideoTagResponseDto> {
	return await GET(`${VIDEO_TAG_API_URI}/search?tagName=${searchVideoTagRequest.tagNameSearchKey}`) as SearchVideoTagResponseDto;
}

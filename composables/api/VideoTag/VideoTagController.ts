import { GET, POST } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { CreateVideoTagResponseDto, GetVideoTagByTagIdRequestDto, GetVideoTagByTagIdResponseDto, SearchVideoTagRequestDto, SearchVideoTagResponseDto } from "./VideoTagControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_TAG_API_URL = `${BACK_END_URL}/video/tag`;

/**
 * 创建视频 TAG
 * @param createVideoTagRequest 视频 TAG 数据
 * @returns 创建视频 TAG 的请求响应
 */
export async function createVideoTag(createVideoTagRequest: CreateVideoTagRequestDto): Promise<CreateVideoTagResponseDto> {
	return await POST(`${VIDEO_TAG_API_URL}/create`, createVideoTagRequest, { credentials: "include" }) as CreateVideoTagResponseDto;
}

/**
 * 搜索视频 TAG
 * @param searchVideoTagRequest 搜索视频的请求载荷
 * @returns 搜索视频的请求响应
 */
export async function searchVideoTag(searchVideoTagRequest: SearchVideoTagRequestDto): Promise<SearchVideoTagResponseDto> {
	return await GET(`${VIDEO_TAG_API_URL}/search?tagName=${searchVideoTagRequest.tagNameSearchKey}`) as SearchVideoTagResponseDto;
}

/**
 * 根据 TAG ID 列表搜索 TAG
 * @param getVideoTagByTagIdRequest 根据 TAG ID 列表搜索 TAG 的请求参数
 * @returns 根据 TAG ID 列表搜索 TAG 的请求响应结果
 */
export const getTagsByTagIds = async (getVideoTagByTagIdRequest: GetVideoTagByTagIdRequestDto): Promise<GetVideoTagByTagIdResponseDto> => {
	if (getVideoTagByTagIdRequest && getVideoTagByTagIdRequest.tagId) {
		const { data: result } = await useFetch<GetVideoTagByTagIdResponseDto>(`${VIDEO_TAG_API_URL}/get`, {
			method: "POST",
			body: { tagId: getVideoTagByTagIdRequest.tagId },
		});
		if (result.value)
			return result.value;
		else
			return { success: false, message: "根据 TAG ID 获取 TAG 失败" };
	} else
		return { success: false, message: "获取 TAG 时未提供 TAG ID" };
};

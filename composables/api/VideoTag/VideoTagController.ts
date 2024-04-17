import { POST } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { CreateVideoTagResponseDto } from "./VideoTagControllerDto";

const BACK_END_URL = getCorrectUri();
const VIDEO_TAG_API_URI = `${BACK_END_URL}/video/tag`;

/**
 * 创建视频 TAG
 * @param createVideoTagRequest 视频数据
 * @returns 上传视频的请求响应
 */
export async function createVideoTag(createVideoTagRequest: CreateVideoTagRequestDto): Promise<CreateVideoTagResponseDto> {
	return await POST(`${VIDEO_TAG_API_URI}/create`, createVideoTagRequest, { credentials: "include" }) as CreateVideoTagResponseDto;
}

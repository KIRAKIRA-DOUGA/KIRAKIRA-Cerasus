import { GET, POST } from "../Common";
import getCorrectUri from "../Common/getCorrectUri";
import type { EmitDanmakuRequestDto, EmitDanmakuResponseDto, GetDanmakuByKvidRequestDto, GetDanmakuByKvidResponseDto } from "./DanmakuControllerDto";

const BACK_END_URL = getCorrectUri();
const DANMAKU_API_URL = `${BACK_END_URL}/video/danmaku`;

/**
 * 用户发送弹幕
 * @param emitDanmakuRequest 用户发送的弹幕数据
 * @returns 用户发送弹幕的结果
 */
export const emitDanmaku = async (emitDanmakuRequest: EmitDanmakuRequestDto): Promise<EmitDanmakuResponseDto> => {
	// TODO: use { credentials: "include" } to allow save/read cookies from cross-origin domains. Maybe we should remove it before deployment to production env.
	return await POST(`${DANMAKU_API_URL}/emit`, emitDanmakuRequest, { credentials: "include" }) as EmitDanmakuResponseDto;
};

/**
 * 根据 kvid 获取视频弹幕列表
 * @param getDanmakuByKvidRequest 请求弹幕列表的查询参数
 * @returns 视频的弹幕列表
 */
export const getDanmakuByKvid = async (getDanmakuByKvidRequest: GetDanmakuByKvidRequestDto): Promise<GetDanmakuByKvidResponseDto> => {
	return await GET(`${DANMAKU_API_URL}?videoId=${getDanmakuByKvidRequest.videoId}`) as GetDanmakuByKvidResponseDto;
};

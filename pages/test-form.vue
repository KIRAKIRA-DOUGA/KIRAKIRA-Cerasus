<script setup lang="ts">
	import { postData } from "api";

	interface userSettingsType {
		_id?: string;
		uuid?: string;
		systemStyle?: string;
		systemColor?: string;
		backgroundAnimation?: boolean;
		settingPageLastEnter?: string;
		__v?: number;
	}
	interface queryResultType {
		queryStatus: boolean;
		queryStatusText: string;
		results: userSettingsType;
	}

	const userIdInput = ref("");
	const userSettingsRef = ref({} as queryResultType);
	const handleSearchUserInfo = async () => {
		try {
			const userId = userIdInput.value;
			if (userId) { // 这里不直接用 if (userId) 是因为用户 ID 可能为数字 0 // 然而是字符串 "0" 没啥问题。
				// 一个可用的获取用户设置信息的 URL 看起来像：https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001
				const userQueryUrl = `https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=${userId}`;
				const { data: userSettingsResultList } = await useFetch(userQueryUrl);
				const fixedUserSettingsResultList = userSettingsResultList.value as userSettingsType[];
				if (fixedUserSettingsResultList) {
					const userSettings = fixedUserSettingsResultList[0];
					if (userSettings) {
						const queryResult = { queryStatus: true, queryStatusText: "查询成功", results: userSettings };
						userSettingsRef.value = queryResult;
					} else {
						console.log("Error in handleSearchUserInfo, required data userSettings is empty");
						const userSettings = { uuid: userId };
						const queryResult = { queryStatus: false, queryStatusText: "查询用户信息失败，返回值解析出错或无法正确处理", results: userSettings };
						userSettingsRef.value = queryResult;
					}
				} else {
					console.log("Error in handleSearchUserInfo, required data fixedUserSettingsResultList is empty");
					const userSettings = { uuid: userId };
					const queryResult = { queryStatus: false, queryStatusText: "查询用户信息失败，返回结果为空", results: userSettings };
					userSettingsRef.value = queryResult;
				}
			} else {
				console.log("Error in handleSearchUserInfo, required data userId is empty");
				const userSettings = {};
				const queryResult = { queryStatus: false, queryStatusText: "查询用户信息失败, userId 为空", results: userSettings };
				userSettingsRef.value = queryResult;
			}
		} catch (e) {
			console.error("Error in handleSearchUserInfo", e);
		}
	};

	const userSettingsInputUuid = ref("");
	const userSettingsInputSystemStyle = ref("");
	const userSettingsInputSystemColor = ref("");
	const userSettingsInputBackgroundAnimation = ref(false);
	const userSettingsInputSettingPageLastEnter = ref("");

	const userSettingsSaveResult = ref();
	const saveUserInfo = () => {
		const userSettingsInput: userSettingsType = {
			uuid: userSettingsInputUuid.value,
			systemStyle: userSettingsInputSystemStyle.value,
			systemColor: userSettingsInputSystemColor.value,
			backgroundAnimation: userSettingsInputBackgroundAnimation.value,
			settingPageLastEnter: userSettingsInputSettingPageLastEnter.value,
		};
		const uuid = userSettingsInput.uuid;
		if (uuid) {
			const saveUserSettingsUrl = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/save";
			postData(saveUserSettingsUrl, userSettingsInput).then(result => {
				userSettingsSaveResult.value = result;
			});
		}
	};

	const userSettingsMount = ref({} as queryResultType);
	const getUserSettings = async () => {
		const url = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001";
		const { data: userSettingsMountResult } = await useFetch(url);
		userSettingsMount.value = userSettingsMountResult.value as queryResultType;
	};

	getUserSettings();

	useHead({ title: "API 测试页" });
</script>

<template>
	<div class="container">
		<h2>测试服务端渲染</h2>
		<div style="margin-top: 10px;">在组件初始化时获取 u00001 用户设定档数据的结果：{{ userSettingsMount }}</div>
		<div style="margin-top: 10px;">上方显示的数据是在前端的服务端中请求的（当前为 vercel.com），您无法在客户端浏览器控制台中找到</div>

		<h2 style="margin-top: 20px;">查询用户设定档</h2>
		<div class="user-info-query-box">
			<div style="width: 400px;">
				<TextBox v-model="userIdInput" size="normal" placeholder="输入你想查询的用户名（输入 u00001 试试看？）" />
			</div>
			<Button icon="send" @click="handleSearchUserInfo">{{ t.query }}</Button>
		</div>
		<div style="margin-top: 10px;">查询结果：{{ userSettingsRef }}</div>

		<h2 style="margin-top: 20px;">新建用户设定档</h2>
		<div class="user-info-save-box">
			<div class="user-info-save-input-box">
				<TextBox v-model="userSettingsInputUuid" size="normal" placeholder="输入用户名" />
			</div>
			<div class="user-info-save-input-box">
				<TextBox v-model="userSettingsInputSystemStyle" size="normal" placeholder="系统样式" />
			</div>
			<div class="user-info-save-input-box">
				<TextBox v-model="userSettingsInputSystemColor" size="normal" placeholder="背景色" />
			</div>
			<div class="user-info-save-input-box">
				<ToggleSwitch v-model="userSettingsInputBackgroundAnimation">是否开启背景动画： {{ userSettingsInputBackgroundAnimation ? t.on : t.off }}</ToggleSwitch>
			</div>
			<div class="user-info-save-input-box">
				<TextBox v-model="userSettingsInputSettingPageLastEnter" size="normal" placeholder="用户最后浏览的设置页" />
			</div>
			<Button style="margin-top: 10px;" @click="saveUserInfo">提交</Button>
		</div>
		<div style="margin-top: 10px;">{{ userSettingsSaveResult }}</div>

	</div>
</template>

<style scoped lang="scss">
	.user-info-query-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 500px;
		margin-top: 10px;
	}

	.user-info-save-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		width: 500px;
		margin-top: 10px;
	}

	.user-info-save-input-box {
		width: 400px;
		margin-top: 10px;
	}

	h1,
	h2,
	.page-title-wrapper {
		color: c(accent);
		font-weight: bold;
		font-size: calc(1.275rem + 0.3dvw);
	}
</style>

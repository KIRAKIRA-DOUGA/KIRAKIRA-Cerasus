<script setup lang="ts">
	import { postData } from "api";

	interface UserSettingsType {
		_id?: string;
		uuid?: string;
		systemStyle?: string;
		systemColor?: string;
		backgroundAnimation?: boolean;
		settingPageLastEnter?: string;
		__v?: number;
	}

	interface QueryResultType {
		queryStatus: boolean;
		queryStatusText: string;
		results: UserSettingsType;
	}

	// TODO: 将以上 interface 标注 JSDoc。

	const userIdInput = ref("");
	const userSettingsRef = ref<Partial<QueryResultType>>({});
	const handleSearchUserInfo = async () => {
		try {
			const userId = userIdInput.value;
			if (userId) { // 这里不直接用 if (userId) 是因为用户 ID 可能为数字 0 // 然而是字符串 "0" 没啥问题。
				// 一个可用的获取用户设置信息的 URL 看起来像：https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001
				const userQueryUrl = `https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=${userId}`;
				const { data: userSettingsResultList } = await useFetch(userQueryUrl);
				const fixedUserSettingsResultList = userSettingsResultList.value as UserSettingsType[];
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
		const userSettingsInput: UserSettingsType = {
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

	// const userSettingsMount = ref({} as queryResultType);
	// const getUserSettings = async () => {
	// 	const url = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001";
	// 	const { data: userSettingsMountResult } = await useFetch(url);
	// 	userSettingsMount.value = userSettingsMountResult.value as queryResultType;
	// };

	// await getUserSettings();

	const url = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001";
	// const url = "https://rosales.kirakira.moe:4001/02/koa/admin/sleep?sleep=5000"; // sleep API 模拟慢速网络请求
	const { data: userSettingsMount } = await useFetch(url);

	useHead({ title: "API 测试页" });
</script>

<template>
	<div class="container">
		<h2>测试首屏服务端渲染</h2>
		<div>请求 u00001 用户设定档数据的结果：</div>
		<pre><code>{{ userSettingsMount }}</code></pre>
		<div>本页是首屏加载时，useFetch 会在运行 Nuxt 的服务端中发起请求（比如说 vercel.com），您无法在客户端浏览器的控制台中找到这条 API 请求，不妨刷新一下页面试试！</div>
		<div>本页不是首屏加载时（比如说你在主页点击了 "API 测试页" 按钮进入本页），useFetch 会在用户客户端中发起请求。这个行为与普通的 Vue3 axios 单页面应用一致，您可以在浏览器中找到 API 请求。</div>

		<h2>查询用户设定档</h2>
		<div class="query">
			<TextBox v-model="userIdInput" size="normal" placeholder="输入你想查询的用户名（输入 u00001 试试看？）" />
			<Button icon="send" @click="handleSearchUserInfo">{{ t.query }}</Button>
		</div>
		<div>查询结果：</div>
		<pre><code>{{ userSettingsRef }}</code></pre>

		<h2>新建用户设定档</h2>
		<div class="save">
			<div>
				<TextBox v-model="userSettingsInputUuid" size="normal" placeholder="输入用户名" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemStyle" size="normal" placeholder="系统样式" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemColor" size="normal" placeholder="背景色" />
			</div>
			<div>
				<ToggleSwitch v-model="userSettingsInputBackgroundAnimation">是否开启背景动画： {{ userSettingsInputBackgroundAnimation ? t.on : t.off }}</ToggleSwitch>
			</div>
			<div>
				<TextBox v-model="userSettingsInputSettingPageLastEnter" size="normal" placeholder="用户最后浏览的设置页" />
			</div>
			<Button @click="saveUserInfo">提交</Button>
		</div>
		<div>{{ userSettingsSaveResult }}</div>

	</div>
</template>

<style scoped lang="scss">
	.query {
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		justify-content: space-between;

		.text-box {
			width: 100%;
		}
	}

	.save {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		margin-top: 0;

		> div {
			width: 100%;
			margin-top: 10px;
		}

		> button {
			margin-top: 10px;
		}
	}

	.container > * {
		margin-top: 10px;
	}

	h2 {
		margin-top: 20px;
		margin-bottom: 10px;
		color: c(accent);
	}

	pre {
		@include radius-large;
		padding: 1rem;
		background-color: c(gray-30);
		
		&,
		* {
			user-select: text;
		}
	}
</style>

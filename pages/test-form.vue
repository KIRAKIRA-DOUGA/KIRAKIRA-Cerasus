<script setup lang="ts">
	import { postData } from "api";

	/**
	 * 使用者设定档
	 *
	 * @param _id MongoDB 自动生成的唯一 ID
	 * @param uuid 使用者 ID
	 * @param systemStyle 系统样式
	 * @param systemColor 背景色
	 * @param backgroundAnimation 是否开启背景动画
	 * @param settingPageLastEnter 使用者最后浏览的设定页
	 * @param __v MongoDB 自动生成的修改次数（版本）
	 */
	interface UserSettingsType {
		_id?: string;
		uuid: string;
		systemStyle: string;
		systemColor: string;
		backgroundAnimation: boolean;
		settingPageLastEnter: string;
		__v?: number;
	}

	/**
	 * 使用者设定档
	 *
	 * @param _id MongoDB 自动生成的唯一 ID
	 * @param uuid 使用者 ID
	 * @param systemStyle 系统样式
	 * @param systemColor 背景色
	 * @param backgroundAnimation 是否开启背景动画
	 * @param settingPageLastEnter 使用者最后浏览的设定页
	 * @param __v MongoDB 自动生成的修改次数（版本）
	 */
	interface UserSettingsUpdateType {
		_id?: string;
		uuid?: string;
		systemStyle?: string;
		systemColor?: string;
		backgroundAnimation?: boolean;
		settingPageLastEnter?: string;
		__v?: number;
	}

	// const url = "https://rosales.kirakira.moe:4001/02/koa/admin/sleep?sleep=5000"; // sleep API 模拟慢速网络请求
	const url = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001";
	const { data: userSettingsMount } = await useFetch(url);

	const userIdInput = ref("");
	const userSettingsRef = ref<Partial<UserSettingsType>>({});
	const handleSearchUserInfo = async () => {
		try {
			const userId = userIdInput.value;
			if (userId) { // 这里不直接用 if (userId) 是因为使用者 ID 可能为数字 0 // 然而是字符串 "0" 没啥问题。// 你是对的，虽然任何人都不能假定输入框工作正常，但同时也不必考虑每一种边界情况。
				// 一个可用的获取使用者设定档的 URL 看起来像：https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=u00001
				const userQueryUrl = `https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/get?uuid=${userId}`;
				const { data: userSettingsResultList } = await useFetch(userQueryUrl);
				const fixedUserSettingsResultList = userSettingsResultList.value as UserSettingsType[];
				if (fixedUserSettingsResultList && fixedUserSettingsResultList.length > 0) {
					const userSettings = fixedUserSettingsResultList[0];
					if (userSettings)
						userSettingsRef.value = userSettings;
					else {
						useToast("查询使用者设定档失败：返回值解析出错或格式不正确", "error", 5000);
						userSettingsRef.value = {};
					}
				} else {
					useToast("查询使用者设定档失败：返回结果为空", "error", 5000);
					userSettingsRef.value = {};
				}
			} else
				useToast("查询使用者设定档失败: 请输入使用者 ID", "error", 5000);
		} catch {
			useToast("查询使用者设定档失败: 未知原因", "error", 5000);
			userSettingsRef.value = {};
		}
	};

	const userSettingsInputUuidInsert = ref("");
	const userSettingsInputSystemStyleInsert = ref("");
	const userSettingsInputSystemColorInsert = ref("");
	const userSettingsInputBackgroundAnimationInsert = ref(false);
	const userSettingsInputSettingPageLastEnterInsert = ref("");

	const userSettingsInsertResult = ref();
	const insertUserInfo = () => {
		if (userSettingsInputUuidInsert.value && userSettingsInputSystemStyleInsert.value && userSettingsInputSystemColorInsert.value && userSettingsInputBackgroundAnimationInsert.value && userSettingsInputSettingPageLastEnterInsert.value) {
			const userSettingsInput: UserSettingsType = {
				uuid: userSettingsInputUuidInsert.value,
				systemStyle: userSettingsInputSystemStyleInsert.value,
				systemColor: userSettingsInputSystemColorInsert.value,
				backgroundAnimation: userSettingsInputBackgroundAnimationInsert.value,
				settingPageLastEnter: userSettingsInputSettingPageLastEnterInsert.value,
			};
	
			const saveUserSettingsUrl = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/save";
			postData(saveUserSettingsUrl, userSettingsInput).then(result => {
				userSettingsInsertResult.value = result;
			});
		} else
			useToast("必须输入完整的使用者设定档才能创建", "error", 5000);
	};

	const userSettingsInputUuidUpdate = ref("");
	const userSettingsInputSystemStyleUpdate = ref("");
	const userSettingsInputSystemColorUpdate = ref("");
	const userSettingsInputBackgroundAnimationUpdate = ref("0");
	const userSettingsInputSettingPageLastEnterUpdate = ref("");

	const userSettingsUpdateResult = ref();
	const updateUserInfo = () => {
		if (userSettingsInputUuidUpdate.value && (userSettingsInputSystemStyleUpdate.value || userSettingsInputSystemColorUpdate.value || (userSettingsInputBackgroundAnimationUpdate.value && userSettingsInputBackgroundAnimationUpdate.value !== "0") || userSettingsInputSettingPageLastEnterUpdate.value)) {
			let fixedUserSettingsInputBackgroundAnimationUpdate: boolean | undefined;
			if (userSettingsInputBackgroundAnimationUpdate.value === "-1")
				fixedUserSettingsInputBackgroundAnimationUpdate = false;
			else if (userSettingsInputBackgroundAnimationUpdate.value === "1")
				fixedUserSettingsInputBackgroundAnimationUpdate = true;
			
			const userSettingsInput: UserSettingsUpdateType = {
				...(userSettingsInputUuidUpdate.value ? { uuid: userSettingsInputUuidUpdate.value } : null),
				...(userSettingsInputSystemStyleUpdate.value ? { systemStyle: userSettingsInputSystemStyleUpdate.value } : null),
				...(userSettingsInputSystemColorUpdate.value ? { systemColor: userSettingsInputSystemColorUpdate.value } : null),
				...(fixedUserSettingsInputBackgroundAnimationUpdate !== null && fixedUserSettingsInputBackgroundAnimationUpdate !== undefined ? { backgroundAnimation: fixedUserSettingsInputBackgroundAnimationUpdate } : null),
				...(userSettingsInputSettingPageLastEnterUpdate.value ? { settingPageLastEnter: userSettingsInputSettingPageLastEnterUpdate.value } : null),
			};
			const saveUserSettingsUrl = "https://rosales.kirakira.moe:4000/02/koa/user/settings/userSettings/update";
			postData(saveUserSettingsUrl, userSettingsInput).then(result => {
				userSettingsUpdateResult.value = result;
			});
		} else
			useToast("必须输入 使用者 ID 和至少一个使用者设定才能更新", "error", 5000);
	};

	useHead({ title: "API 测试页" });
</script>

<template>
	<div class="container">
		<h2>测试首屏服务端渲染</h2>
		<div>请求 u00001 使用者设定档数据的结果：</div>
		<pre><code>{{ userSettingsMount }}</code></pre>
		<div>本页是首屏加载时，useFetch 会在运行 Nuxt 的服务端中发起请求（比如说 vercel.com），您无法在客户端浏览器的控制台中找到这条 API 请求，不妨刷新一下页面试试！</div>
		<div>本页不是首屏加载时（比如说你在主页点击了 "API 测试页" 按钮进入本页），useFetch 会在用户的客户端中发起请求。这个行为与普通的 Vue3 axios 单页面应用一致，您可以在浏览器中找到 API 请求。</div>

		<h2>查询用户设定档</h2>
		<div class="query">
			<TextBox v-model="userIdInput" size="normal" placeholder="输入你想查询的使用者 ID（输入 u00001 试试看？）" />
			<Button icon="send" @click="handleSearchUserInfo">{{ t.query }}</Button>
		</div>
		<div>查询结果：</div>
		<pre><code>{{ userSettingsRef }}</code></pre>

		<h2>创建新的使用者设定档</h2>
		<div class="save">
			<div>
				<TextBox v-model="userSettingsInputUuidInsert" size="normal" placeholder="使用者 ID" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemStyleInsert" size="normal" placeholder="系统样式" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemColorInsert" size="normal" placeholder="背景色" />
			</div>
			<div>
				<ToggleSwitch v-model="userSettingsInputBackgroundAnimationInsert">是否开启背景动画： {{ userSettingsInputBackgroundAnimationInsert ? t.on : t.off }}</ToggleSwitch>
			</div>
			<div>
				<TextBox v-model="userSettingsInputSettingPageLastEnterInsert" size="normal" placeholder="使用者最后浏览的设定页" />
			</div>
			<Button @click="insertUserInfo">提交</Button>
		</div>
		<div>{{ userSettingsInsertResult }}</div>

		<h2>更新使用者设定档</h2>
		<div class="update">
			<div>
				<TextBox v-model="userSettingsInputUuidUpdate" size="normal" placeholder="输入一个已经存在使用者 ID" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemStyleUpdate" size="normal" placeholder="系统样式" />
			</div>
			<div>
				<TextBox v-model="userSettingsInputSystemColorUpdate" size="normal" placeholder="背景色" />
			</div>
			选择是否启用背景动画
			<Segmented v-model="userSettingsInputBackgroundAnimationUpdate">
				<SegmentedItem id="1">启用</SegmentedItem>
				<SegmentedItem id="0">/</SegmentedItem>
				<SegmentedItem id="-1">不启用</SegmentedItem>
			</Segmented>
			<div>
				<TextBox v-model="userSettingsInputSettingPageLastEnterUpdate" size="normal" placeholder="使用者最后浏览的设定页" />
			</div>
			<Button @click="updateUserInfo">更新</Button>
		</div>
		<div>{{ userSettingsUpdateResult }}</div>

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

	.save, .update {
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
		margin-top: 30px !important;
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

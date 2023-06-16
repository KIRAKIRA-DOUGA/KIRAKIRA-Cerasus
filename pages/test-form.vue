<script setup lang="ts">
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
	useHead({ title: "API 测试页" });
	const inputValue = ref();
	const userSettingsRef = ref({} as queryResultType);
	const handleSearchUserInfo = async () => {
		try {
			const userId = inputValue.value;
			if (userId !== undefined && userId !== null && userId !== "") { // WARN 这里不直接用 if (userId) 是因为用户 ID 可能为数字 0
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
</script>

<template>
	<div class="container">
		<div class="user-info-query-box">
			<div style="width: 400px;">
				<TextBox v-model="inputValue" size="normal" placeholder="输入你想查询的用户名（输入 u00001 试试看？）" />
			</div>
			<Button @click="handleSearchUserInfo" icon="send">{{ t.query }}</Button>
		</div>
		
		<div style="margin-top: 10px;">{{ userSettingsRef }}</div>
	</div>
</template>

<style scoped lang="scss">
	.user-info-query-box {
		width: 500px;
		display: flex;
		justify-content: space-between;
    flex-direction: row;
    align-items: center;
	}
</style>

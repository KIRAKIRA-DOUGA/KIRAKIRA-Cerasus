<docs>
	# 用户管理
</docs>

<script setup lang="ts">
	const itemPerPage = ref(100); // TODO: 下拉框指定单页显示的用户数目。
	const currentPage = ref(1);
	const pages = 6; // TODO: 目前无获取用户总数的 API，暂时假定总共只有 6 页。
	const users = ref<UserInfo[]>([]);
	const sortedUsers = computed(() => users.value.toSorted((userA, userB) => userA.uid - userB.uid));
	type UserInfo = GetUserInfoByUidResponseDto["result"] & { uid: number };

	/**
	 * 刷新用户信息列表。
	 * @param page - 当前页码。
	 */
	function refreshUserInfos(page?: number) {
		page ??= currentPage.value;
		users.value = [];
		const _users = users.value; // TODO: 切换页码后，如果前一页的数据没有加载完，会导致新旧页面的数据混合在一起。并且旧页面加载无法取消。此处采用放弃旧数组的指针，直接用新数组指针替换之的方法暂时解决，但这并不会停止对旧数组的加载，虽不影响显示效果，但仍然会占用带宽和流量。
		const start = (page - 1) * itemPerPage.value + 1;
		const end = page * itemPerPage.value;
		for (let uid = start; uid <= end; uid++)
			api.user.getUserInfo({ uid }).then(result => {
				if (!result.success || !result.result) return;
				const userInfo = result.result;
				_users.push({ ...userInfo, uid });
			});
	}

	watch(currentPage, () => refreshUserInfos(), { immediate: true });
</script>

<template>
	<Pagination v-model="currentPage" :pages />
	<section>
		<SettingsChipItem
			v-for="user in sortedUsers"
			:key="user.uid"
			:image="user.avatar"
			icon="account_circle"
			:details="`UID ${user.uid}` + (user.signature?.trim() ? ` - ${user.signature}` : '')"
			trailingIcon="open_in_new"
			:href="`/user/${user.uid}`"
		>
			<div class="name">
				<span class="nickname">{{ user.userNickname }}</span>
				<span class="username">@{{ user.username }}</span>
				<div class="icons">
					<Icon v-if="user.gender === 'male' " name="male" class="male" />
					<Icon v-else-if="user.gender === 'female'" name="female" class="female" />
				</div>
			</div>
		</SettingsChipItem>
	</section>
</template>

<style scoped lang="scss">
	.name {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;

		.nickname {
			font-weight: bold;
		}

		.username {
			color: c(icon-color);
		}

		.icons {
			@include flex-center;

			.male {
				color: c(blue);
			}

			.female {
				color: c(pink);
			}
		}
	}
</style>

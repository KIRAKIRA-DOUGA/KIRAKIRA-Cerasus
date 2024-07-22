<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const myInvitationCode = ref<GetMyInvitationCodeResponseDto["invitationCodeResult"]>();

	/**
	 * 生成邀请码
	 */
	async function generationInvitationCode() {
		const generationInvitationCode = await api.user.generationInvitationCode();
		if (generationInvitationCode.success)
			await getMyInvitationCode();
	}

	/**
	 * 获取邀请码列表
	 */
	async function getMyInvitationCode() {
		const getMyInvitationCodeResult = await api.user.getMyInvitationCode();
		if (getMyInvitationCodeResult.success && getMyInvitationCodeResult.invitationCodeResult?.length >= 0)
			myInvitationCode.value = getMyInvitationCodeResult.invitationCodeResult;
	}

	/**
	 * 复制邀请码到剪贴板
	 * @param invitationCode 要被复制到剪贴板的邀请码
	 */
	async function copyInvitationCode(invitationCode: string) {
		try {
			await navigator.clipboard.writeText(invitationCode);
			useToast("邀请码已复制到剪贴板~", "success"); // TODO: 使用多语言
		} catch (error) {
			useToast("复制邀请码失败", "error"); // TODO: 使用多语言
		}
	}

	await getMyInvitationCode();

	// 发生用户登录事件时获取用户的邀请码
	useListen("user:login", async loginStatus => {
		if (loginStatus)
			await getMyInvitationCode();
	});
</script>

<template>
	<div class="user-profile" @click="navigate('/settings/profile')">
		<div class="avatar">
			<UserAvatar :avatar="selfUserInfoStore.isLogined ? selfUserInfoStore.userAvatar : undefined" />
		</div>
		<div class="text">
			<div class="username">{{ selfUserInfoStore.username }}</div>
			<div class="bio">TODO: Bio here</div>
		</div>
	</div>

	<div class="invitation-code-counts chip">
		<div>
			<span class="value">233</span>
			<!-- // TODO: 使用多语言 -->
			<p>总邀请码数量</p>
		</div>
		<div>
			<span class="value">233</span>
			<!-- // TODO: 使用多语言 -->
			<p>已使用邀请码</p>
		</div>
		<div>
			<span class="value">233</span>
			<!-- // TODO: 使用多语言 -->
			<p>剩余可申请</p>
		</div>
	</div>

	<div class="invitation-code-list-title">
		<!-- // TODO: 使用多语言 -->
		<Subheader icon="link">邀请码列表</Subheader>
		<!-- // TODO: 使用多语言 -->
		<Button class="secondary" icon="add" @click="generationInvitationCode">生成一个新邀请码</Button>
	</div>

	<div class="user-info chip">
		<SettingsChipItem
			v-for="invitationCode in myInvitationCode"
			:key="invitationCode.invitationCode"
			icon="link"
			trailingIcon="copy"
			:onTrailingIconClick="() => copyInvitationCode(invitationCode.invitationCode)"
			:details="!!invitationCode.assignee ? '已使用' : '未使用'"
		>
			{{ invitationCode.invitationCode }}
		</SettingsChipItem>
	</div>
</template>

<style scoped lang="scss">
	.user-profile {
		display: flex;
		gap: 16px;
		width: fit-content;
		cursor: pointer;

		.user-avatar {
			@include square(64px);
		}

		.text {
			display: flex;
			flex-direction: column;
			gap: 6px;
			justify-content: center;

			.username {
				font-size: 24px;
				font-weight: bold;
			}

			.bio {
				color: c(icon-color);
			}
		}
	}

	.invitation-code-counts {
		display: flex;
		justify-content: space-around;
		padding: 14px 0;

		> div {
			@include flex-center;
			flex-direction: column;
			width: 25%;

			span {
				font-size: 24px;
				font-weight: bold;
			}

			p {
				color: c(icon-color);
			}
		}
	}

	.invitation-code-list-title {
		display: flex;
		justify-content: space-between;
	}
</style>

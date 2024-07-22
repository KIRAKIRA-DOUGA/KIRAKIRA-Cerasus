<script setup lang="ts">
	const myInvitationCode = ref<GetMyInvitationCodeResponseDto["invitationCodeResult"]>();

	/**
	 * 生成邀请码
	 */
	async function generationInvitationCode() { // TODO: 改成createInvitationCode或者generateInvitationCode，前端这边现在是create。
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
			useToast(t.copy.success, "success");
		} catch (error) {
			useToast(t.copy.failed, "error");
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
	<div class="invitation-code-counts chip">
		<div>
			<span>233</span>
			<p>{{ t.total }}</p>
		</div>
		<div>
			<span>233</span>
			<p>{{ t.used }}</p>
		</div>
		<div>
			<span>233</span>
			<p>{{ t.unused }}</p>
		</div>
		<div>
			<span>233</span>
			<p>{{ t.creatable }}</p>
		</div>
	</div>

	<SoftButton v-tooltip:bottom="t.create" class="create-button" icon="add" @click="generationInvitationCode" />

	<div class="user-info chip">
		<SettingsChipItem
			v-for="invitationCode in myInvitationCode"
			:key="invitationCode.invitationCode"
			icon="gift"
			trailingIcon="copy"
			:onTrailingIconClick="() => copyInvitationCode(invitationCode.invitationCode)"
			:details="!!invitationCode.assignee ? t.used : t.unused"
		>
			{{ invitationCode.invitationCode }}
		</SettingsChipItem>
	</div>
</template>

<style scoped lang="scss">
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

	.create-button {
		--wrapper-size: 48px;
		--ripple-size: var(--wrapper-size);
		margin-left: auto;
	}
</style>

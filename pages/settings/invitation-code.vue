<script setup lang="ts">
	const myInvitationCode = ref<GetMyInvitationCodeResponseDto["invitationCodeResult"]>();
	const totalInvitationCode = computed(() => myInvitationCode.value?.length ?? 0);
	const totalUsedInvitationCode = computed(() => myInvitationCode.value?.filter(invitationCode => !!invitationCode.assignee)?.length ?? 0);
	const totalUnusedInvitationCode = computed(() => myInvitationCode.value?.filter(invitationCode => !invitationCode.assignee)?.length ?? 0);

	const selfUserInfoStore = useSelfUserInfoStore();

	/**
	 * 生成邀请码
	 */
	async function createInvitationCode() {
		const createInvitationCodeResult = await api.user.createInvitationCode();

		if (createInvitationCodeResult.isCoolingDown) {
			useToast(t.toast.cooling_down, "warning", 5000); // TODO: 需要显示冷却剩余时间，需要API返回。
			return;
		}
		if (createInvitationCodeResult.success)
			await getMyInvitationCode();
		else
			useToast(t.toast.something_went_wrong, "error");
	}

	/**
	 * 获取邀请码列表
	 */
	async function getMyInvitationCode() {
		const headerCookie = useRequestHeaders(["cookie"]);
		const getMyInvitationCodeResult = await api.user.getMyInvitationCode(headerCookie);
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
			useToast(t.toast.copied, "success");
		} catch (error) {
			useToast(t.toast.copy_failed, "error");
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
	<div>
		<div class="invitation-code-counts chip">
			<div>
				<span>{{ totalInvitationCode }}</span>
				<p>{{ t.total }}</p>
			</div>
			<div>
				<span>{{ totalUsedInvitationCode }}</span>
				<p>{{ t.used }}</p>
			</div>
			<div>
				<span>{{ totalUnusedInvitationCode }}</span>
				<p>{{ t.unused }}</p>
			</div>
		<!-- TODO: Creatable Invitation Code Count -->
		<!-- <div>
			<span>233</span>
			<p>{{ t.creatable }}</p>
		</div> -->
		</div>

		<SoftButton v-tooltip:bottom="t.create" class="create-button" icon="add" @click="createInvitationCode" />

		<div class="user-info chip">
			<SettingsChipItem
				v-for="invitationCode in myInvitationCode"
				:key="invitationCode.invitationCode"
				icon="gift"
				trailingIcon="copy"
				:onTrailingIconClick="() => copyInvitationCode(invitationCode.invitationCode)"
				:details="invitationCode.assignee !== null && invitationCode.assignee !== undefined ? t.used : t.unused"
			>
				{{ invitationCode.invitationCode }}
			</SettingsChipItem>
		</div>
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

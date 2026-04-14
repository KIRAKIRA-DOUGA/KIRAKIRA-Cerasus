<script setup lang="ts">
	const { t } = useI18n();
	const selfUserInfoStore = useSelfUserInfoStore();
	// const userBirthdayDisplay = computed(() => selfUserInfoStore.userInfo.userBirthday ? formatDateWithLocale(new Date(selfUserInfoStore.userInfo.userBirthday)) : "Unknown"); // TODO: 生日功能适配temporal

	/**
	 * 复制内容到剪贴板。
	 * @param content - 要复制的内容。
	 */
	async function copy(content: Readable) {
		if (!content) return;
		try {
			await navigator.clipboard.writeText(content.toString());
			useToast(t("toast.copied"), "success");
		} catch {
			useToast(t("toast.copy_failed"), "error");
		}
	}
</script>

<template>
	<div>
		<!-- TODO: 请在至少一个计数做完之后启用 -->
		<!-- <div class="user-counts chip">
			<div>
				<span class="value">233</span>
				<p>{{ $t("following") }}</p>
			</div>
			<div>
				<span class="value">233</span>
				<p>{{ $t("follower", 2) }}</p>
			</div>
			<div>
				<span class="value">233</span>
				<p>{{ $t("watched") }}</p>
			</div>
			<div>
				<span class="value">233</span>
				<p>{{ $t("rating") }}</p>
			</div>
		</div> -->

		<div class="user-info chip">
			<!-- TODO: 生日功能适配temporal -->
			<!-- <SettingsChipItem icon="birthday" :details="userBirthdayDisplay">{{ t.user.birthday }}</SettingsChipItem> -->
			<SettingsChipItem
				v-if="selfUserInfoStore.userInfo.userCreateDateTime"
				icon="history"
				:details="formatDateWithLocale(new Date(selfUserInfoStore.userInfo.userCreateDateTime))"
			>
				{{ $t("user.join_time") }}
			</SettingsChipItem>
			<SettingsChipItem
				v-if="selfUserInfoStore.userInfo.uid"
				icon="fingerprint"
				:details="selfUserInfoStore.isLoggedIn ? selfUserInfoStore.userInfo.uid : undefined"
				trailingIcon="copy"
				:onTrailingIconClick="() => copy(selfUserInfoStore.userInfo.uid!)"
			>
				UID
			</SettingsChipItem>
			<SettingsChipItem
				v-if="selfUserInfoStore.userInfo.invitationCode"
				icon="gift"
				:details="selfUserInfoStore.userInfo.invitationCode"
				trailingIcon="copy"
				:onTrailingIconClick="() => copy(selfUserInfoStore.userInfo.invitationCode!)"
			>
				使用邀请码
			</SettingsChipItem>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.user-profile {
		display: flex;
		width: fit-content;
		cursor: pointer;
	}

	.user-counts {
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
</style>

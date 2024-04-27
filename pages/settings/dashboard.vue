<script setup lang="ts">
	const registerDate = ref(new Date());
	const registerDateDisplay = computed(() => formatDateWithLocale(registerDate.value));
	const selfUserInfoStore = useSelfUserInfoStore();
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

	<div class="user-counts chip">
		<div>
			<span class="value">233</span>
			<p>{{ t.follow }}</p>
		</div>
		<div>
			<span class="value">233</span>
			<p>{{ t.fans }}</p>
		</div>
		<div>
			<span class="value">233</span>
			<p>{{ t.watched }}</p>
		</div>
		<div>
			<span class="value">233</span>
			<p>{{ t.rating }}</p>
		</div>
	</div>

	<div class="user-info chip">
		<SettingsChipItem icon="birthday" :details="registerDateDisplay">{{ t.user.birthday }}</SettingsChipItem>
		<SettingsChipItem icon="history" :details="registerDateDisplay">{{ t.user.join_time }}</SettingsChipItem>
		<SettingsChipItem icon="fingerprint" :details="selfUserInfoStore.isLogined ? selfUserInfoStore.uid : undefined">UID</SettingsChipItem>
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
				font-weight: bold;
				font-size: 24px;
			}

			.bio {
				color: c(icon-color);
			}
		}
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
				font-weight: bold;
				font-size: 24px;
			}

			p {
				color: c(icon-color);
			}
		}
	}
</style>

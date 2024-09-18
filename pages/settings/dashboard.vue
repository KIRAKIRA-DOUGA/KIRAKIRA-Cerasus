<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const userBirthdayDisplay = computed(() => selfUserInfoStore.birthday ? formatDateWithLocale(new Date(selfUserInfoStore.birthday)) : "Unknown");
	const registerDateDisplay = computed(() => selfUserInfoStore.userCreateDateTime ? formatDateWithLocale(new Date(selfUserInfoStore.userCreateDateTime)) : "Unknown");
</script>

<template>
	<div>
		<div class="user-profile" @click="navigate('/settings/profile')">
			<div class="avatar">
				<UserAvatar :avatar="selfUserInfoStore.isLogined ? selfUserInfoStore.userAvatar : undefined" />
			</div>
			<div class="text">
				<div class="name">
					<span class="nickname">{{ selfUserInfoStore.userNickname }}</span>
					<span class="username">@{{ selfUserInfoStore.username }}</span>
					<div class="icons">
						<Icon v-if="selfUserInfoStore.gender === 'male' " name="male" class="male" />
						<Icon v-else-if="selfUserInfoStore.gender === 'female'" name="female" class="female" />
					</div>
				</div>
				<div class="bio">{{ selfUserInfoStore.signature }}</div>
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
			<SettingsChipItem icon="birthday" :details="userBirthdayDisplay">{{ t.user.birthday }}</SettingsChipItem>
			<SettingsChipItem icon="history" :details="registerDateDisplay">{{ t.user.join_time }}</SettingsChipItem>
			<SettingsChipItem icon="fingerprint" :details="selfUserInfoStore.isLogined ? selfUserInfoStore.uid : undefined">UID</SettingsChipItem>
			<SettingsChipItem icon="gift" :details="`TODO`">使用邀请码</SettingsChipItem>
		</div>
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

			.name {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;
				align-items: center;
				font-size: 24px;

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
				font-size: 24px;
				font-weight: bold;
			}

			p {
				color: c(icon-color);
			}
		}
	}
</style>

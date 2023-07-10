<script setup lang="ts">
	import users from "helpers/users";

	const uid = currentUserUid();
	const user = users[uid] ?? {};
</script>

<template>
	<div class="container">
		<div class="toolbox-card center">

		</div>

		<div class="right">
			<div class="toolbox-card">
				<div class="user-counts">
					<div>
						<span class="value">{{ user.follow }}</span>
						<p>{{ t.follow }}</p>
					</div>
					<div>
						<span class="value">{{ user.fans }}</span>
						<p>{{ t.fans }}</p>
					</div>
					<div>
						<span class="value">{{ user.watches }}</span>
						<p>{{ t.watches }}</p>
					</div>
					<div>
						<span class="value">{{ user.rating }}</span>
						<p>{{ t.rating }}</p>
					</div>
				</div>
			</div>

			<div class="toolbox-card">
				<div class="user-info">
					<h3>{{ t.user_info }}</h3>
					<div class="items">
						<div v-tooltip:x="t.birthday" class="birthday">
							<Icon name="birthday" />
							<span>{{ formatDate(user.birthday, "yyyy-MM-dd") }}</span>
						</div>

						<div v-tooltip:x="t.join_time" class="join-time">
							<Icon name="history" />
							<span>{{ formatDate(user.joinTime, "yyyy-MM-dd") }}</span>
						</div>

						<div v-tooltip:x="'UID'" class="uid">
							<Icon name="fingerprint" />
							<span>{{ user.uid }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		display: flex;
	}

	.right {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		
		@include tablet {
			width: 100%;
		}
	}

	.user-counts {
		display: flex;
		justify-content: space-around;

		> * {
			@include flex-center;
			flex-direction: column;

			span {
				font-weight: bold;
				font-size: 20px;
			}

			p {
				color: c(icon-color);
				font-size: 13px;
			}
		}
	}

	.user-info {
		h3 {
			font-weight: bold;
			font-size: 20px;
		}

		.items {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			margin-top: 1rem;

			> * {
				display: flex;
				gap: 8px;
				align-items: center;
			}

			.icon {
				font-size: 24px;
			}
		}

		.birthday .icon {
			color: c(pink);
		}

		.join-time .icon {
			color: c(orange);
		}

		.uid .icon {
			color: c(green);
		}
	}
</style>

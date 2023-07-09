<script setup lang="ts">

</script>

<template>
	<div class="container">
		<div class="toolbox-card center">

		</div>

		<div class="right">
			<div class="toolbox-card">
				<div class="user-counts">
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
						<p>{{ t.views }}</p>
					</div>
					<div>
						<span class="value">233</span>
						<p>{{ t.rating }}</p>
					</div>
				</div>
			</div>

			<div class="toolbox-card">
				<div class="user-info">
					<h3>个人信息</h3>
					<div class="items">
						<div class="birthday">
							<Icon name="birthday" />
							<span>Birthday</span>
						</div>

						<div class="join-time">
							<Icon name="history" />
							<span>Join Time</span>
						</div>

						<div class="uid">
							<Icon name="fingerprint" />
							<span>UID</span>
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
	}

	.user-counts {
		display: flex;
		justify-content: space-around;

		> div {
			@include flex-center;
			flex-direction: column;
			width: 25%;

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

		.birthday {
			.icon {
				color: c(pink);
			}
		}

		.join-time {
			.icon {
				color: c(orange);
			}
		}

		.uid {
			.icon {
				color: c(green);
			}
		}
	}
</style>

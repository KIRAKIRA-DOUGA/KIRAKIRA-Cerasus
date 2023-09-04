<!-- DELETE: 即将删除！ -->

<script setup lang="ts">

</script>

<template>
	<Comp>
		<div class="leading">
			<slot name="leading"></slot>
		</div>
		<div class="trailing">
			<slot name="trailing"></slot>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include sidebar-shadow-colored;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 56px;
		background-color: c(accent);

		& > div {
			display: flex;
			align-items: center;
			color: white;
			font-weight: 700;
			font-size: 20px;
			letter-spacing: 0.15px;

			:deep(.soft-button) {
				--wrapper-size: 48px;
				--ripple-size: 48px;

				.icon {
					color: white;
				}
			}
		}

		.leading {
			gap: 8px;
			padding-left: 4px;

			:deep(.user-avatar) {
				--wrapper-size: 48px;
				--ripple-size: 48px;
				margin-right: 4px;

				.icon {
					color: white;
				}
			}
		}

		.trailing {
			padding-right: 4px;
		}
	}
</style>

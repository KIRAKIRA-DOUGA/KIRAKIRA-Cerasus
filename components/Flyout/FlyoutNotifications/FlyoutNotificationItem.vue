<docs>
	# 通知浮窗的每条通知内容
</docs>

<script setup lang="ts">

</script>

<template>
	<Comp>
		<UserAvatar />
		<div class="content">
			<p class="name">Name</p>
			<p class="text">Example text.</p>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		@include chip-shadow;
		display: flex;
		gap: 16px;
		padding: 16px;
		background-color: c(surface-color, 75%);

		.user-avatar {
			--size: 42px;
		}

		.content {
			display: flex;
			flex-direction: column;
			gap: 4px;

			.name {
				font-size: 16px;
				font-weight: bold;
			}
		}
	}
</style>

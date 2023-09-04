<!-- DELETE: 即将删除！ -->

<script setup lang="ts">

</script>

<template>
	<TopBar>
		<template #leading>
			<Icon name="dehaze" class="decorative-icon" />
			<UserAvatar />
			<LogoText />
		</template>
		<template #trailing>
			<SoftButton v-tooltip:bottom="t.messages" icon="email" />
			<SoftButton v-tooltip:bottom="t.search" icon="search" href="/search" />
		</template>
	</TopBar>

	<TopBar>
		<template #leading>
			<Icon name="dehaze" class="decorative-icon" />
			<UserAvatar />
			分区
		</template>=
		<template #trailing>
			<SoftButton v-tooltip:bottom="t.messages" icon="email" />
			<SoftButton v-tooltip:bottom="t.search" icon="search" href="/search" />
		</template>
	</TopBar>

	<TopBar>
		<template #leading>
			<SoftButton v-tooltip:bottom="t.navigation.back" icon="arrow_left" />
			This is a Title
		</template>
	</TopBar>
</template>

<style scoped lang="scss">
	.top-bar {
		top: 0;

		.decorative-icon {
			$size: 24px;
			margin-left: calc($size / -2) - 4px;
			color: white;
			font-size: $size;
		}

		.logo-text {
			--form: logo_half;

			:deep(> div) {
				color: white;
			}
		}

		.user-avatar {
			--size: 40px;
		}
	}
</style>

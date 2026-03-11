<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
</script>

<template>
	<ContentUnavailable
		v-if="!selfUserInfoStore.isLogined"
		icon="star"
		:title="$t('collection.title')"
		:description="$t('login_prompt.collections')"
		page
		needLogin
	/>
	<div v-else class="container">
	</div>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">

</script>

<template>
	<div class="privacy-header">
		<Subheader icon="visibility">个人内容可见性</Subheader>
		<div class="options">
			<Icon v-tooltip="{ title: '公开', placement: 'top' }" name="visibility" />
			<Icon v-tooltip="{ title: '仅自己关注的人可见', placement: 'top' }" name="person_add" />
			<Icon v-tooltip="{ title: '仅自己可见', placement: 'top' }" name="visibility_off" />
		</div>
	</div>
	<div class="chip column">
		<SettingsPrivacyItem>{{ t.birthday }}</SettingsPrivacyItem>
		<SettingsPrivacyItem>{{ t.gender }}</SettingsPrivacyItem>
		<SettingsPrivacyItem>关注</SettingsPrivacyItem>
		<SettingsPrivacyItem>粉丝</SettingsPrivacyItem>
		<SettingsPrivacyItem>收藏</SettingsPrivacyItem>
		<SettingsPrivacyItem>注册时间</SettingsPrivacyItem>
	</div>

	<div class="submit">
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.save }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.privacy-header {
		display: flex;
		justify-content: space-between;
	}

	.options {
		display: flex;
		gap: 28px;
		justify-content: flex-end;
		margin-right: 18px;
		color: c(icon-color);
		font-size: 24px;
	}

	.submit {
		display: flex;
		justify-content: flex-end;
	}
</style>

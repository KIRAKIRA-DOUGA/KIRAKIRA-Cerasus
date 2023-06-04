<script setup lang="ts">
	import { PrivacyType } from "components/Settings/SettingsPrivacyItem.vue";

	const visibilities = reactive<{ name: string; icon?: string; privacy: PrivacyType }[]>([
		{ name: "生日", icon: "birthday", privacy: "public" },
		{ name: "关注", privacy: "public" },
		{ name: "粉丝", privacy: "public" },
		{ name: "收藏", icon: "star", privacy: "public" },
		{ name: "Twitter", privacy: "public" },
		{ name: "QQ", privacy: "public" },
		{ name: "哔哩哔哩", privacy: "public" },
		{ name: "ニコニコ", privacy: "public" },
		{ name: "音MAD维基", privacy: "public" },
		{ name: "微博", privacy: "public" },
		{ name: "电话号码", privacy: "private" },
	]);

	/**
	 * 快速设置一列的可见性。
	 * @param privacy - 隐私可见性。
	 */
	function setColonVisibility(privacy: PrivacyType) {
		visibilities.forEach(item => item.privacy = privacy);
	}
</script>

<template>
	<div class="privacy-header">
		<Subheader icon="visibility">个人内容可见性</Subheader>
		<div class="options">
			<SoftKey v-tooltip:top="'公开'" icon="visibility" @click="setColonVisibility('public')" />
			<SoftKey v-tooltip:top="'仅你关注的人可见'" icon="person_add" @click="setColonVisibility('following')" />
			<SoftKey v-tooltip:top="'私密'" icon="visibility_off" @click="setColonVisibility('private')" />
		</div>
	</div>
	<div class="chip column">
		<SettingsPrivacyItem
			v-for="item in visibilities"
			:key="item.name"
			v-model="item.privacy"
			:icon="item.icon || 'placeholder'"
		>{{ item.name }}</SettingsPrivacyItem>
	</div>

	<Subheader icon="cookie">网络曲奇☆</Subheader>
	<div class="chip column">
		<ToggleSwitch v-ripple on icon="cookie">允许网站使用Cookie</ToggleSwitch>
	</div>

	<div class="submit">
		<Button icon="reset" secondary>{{ t.reset }}</Button>
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.apply }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.privacy-header {
		display: flex;
		justify-content: space-between;

		.soft-key {
			--ripple-size: 50px;
		}
	}

	.options {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-right: 11px;
	}
</style>

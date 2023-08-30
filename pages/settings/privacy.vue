<script setup lang="ts">
	const visibilities = reactive<{ name: string; icon?: string; logo?: string; privacy: PrivacyType }[]>([
		{ name: t.birthday, icon: "birthday", privacy: "public" },
		{ name: t.user.age, icon: "calendar", privacy: "public" },
		{ name: t.user.gender, icon: "gender", privacy: "public" },
		{ name: t.follow, icon: "person_add", privacy: "public" },
		{ name: t.fans, icon: "person_heart", privacy: "public" },
		{ name: t.favorites, icon: "star", privacy: "public" },
		{ name: t.platform.twitter, logo: "twitter", privacy: "public" },
		{ name: t.platform.qq, logo: "qq", privacy: "public" },
		{ name: t.platform.bilibili, logo: "bilibili", privacy: "public" },
		{ name: t.platform.niconico, logo: "niconico", privacy: "public" },
		{ name: t.platform.youtube, logo: "youtube", privacy: "public" },
		{ name: t.platform.otomad_wiki, logo: "otomadwiki", privacy: "public" },
		{ name: t.platform.weibo, logo: "weibo", privacy: "public" },
		{ name: t.platform.discord, logo: "discord", privacy: "public" },
		{ name: t.platform.telegram, logo: "telegram", privacy: "public" },
		{ name: t.platform.midishow, logo: "midi", privacy: "public" },
		// { name: "电话号码", icon: "phone", privacy: "private" },
	]);

	const enableCookie = computed({
		get: () => true,
		set: value => !value && useToast("禁用Cookie失败！", "error"),
	});

	/**
	 * 快速设置一列的可见性。
	 * @param privacy - 隐私可见性。
	 */
	function setColonVisibility(privacy: PrivacyType) {
		visibilities.forEach(item => item.privacy = privacy);
	}
</script>

<template>
	<Subheader icon="cookie">网络曲奇☆</Subheader>
	<section list>
		<ToggleSwitch v-model="enableCookie" v-ripple icon="cookie">{{ t.settings.privacy.allow_cookies }}</ToggleSwitch>
	</section>

	<div class="privacy-header">
		<Subheader icon="visibility">{{ t.settings.privacy.info_visibility }}</Subheader>
		<div class="options">
			<SoftButton v-tooltip:top="'公开'" icon="visibility" @click="setColonVisibility('public')" />
			<SoftButton v-tooltip:top="'仅你关注的人可见'" icon="person_add" @click="setColonVisibility('following')" />
			<SoftButton v-tooltip:top="'私密'" icon="visibility_off" @click="setColonVisibility('private')" />
		</div>
	</div>
	<section list>
		<SettingsPrivacyItem
			v-for="item in visibilities"
			:key="item.name"
			v-model="item.privacy"
			:icon="item.logo ? 'mono-logo/' + item.logo : item.icon || 'placeholder'"
		>{{ item.name }}</SettingsPrivacyItem>
	</section>

	<div class="submit"><!-- TODO: 建议将按钮固定在底部更为合适。 -->
		<Button icon="reset" class="secondary">{{ t.reset }}</Button>
		<Button icon="check" @click="useToast('修改失败', 'error');">{{ t.apply }}</Button>
	</div>
</template>

<style scoped lang="scss">
	.privacy-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: -8px;

		.soft-button {
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

<script setup lang="ts">
	const visibilities = reactive<{ name: string; icon?: string; logo?: string; privacy: PrivacyType }[]>([
		{ name: t.user.birthday, icon: "birthday", privacy: "public" },
		{ name: t.user.age, icon: "calendar", privacy: "public" },
		{ name: t.follow, icon: "person_add", privacy: "public" },
		{ name: t.fans, icon: "person_heart", privacy: "public" },
		{ name: t.favorites, icon: "star", privacy: "public" },
		{ name: t.platform.twitter, logo: "twitter", privacy: "public" },
		{ name: t.platform.qq, logo: "qq", privacy: "public" },
		{ name: t.platform.wechat, logo: "wechat", privacy: "public" },
		{ name: t.platform.bilibili, logo: "bilibili", privacy: "public" },
		{ name: t.platform.niconico, logo: "niconico", privacy: "public" },
		{ name: t.platform.youtube, logo: "youtube", privacy: "public" },
		{ name: t.platform.otomad_wiki, logo: "otomadwiki", privacy: "public" },
		{ name: t.platform.weibo, logo: "weibo", privacy: "public" },
		{ name: t.platform.tieba, logo: "tieba", privacy: "public" },
		{ name: t.platform.cloudmusic, logo: "cloudmusic", privacy: "public" },
		{ name: t.platform.discord, logo: "discord", privacy: "public" },
		{ name: t.platform.telegram, logo: "telegram", privacy: "public" },
		{ name: t.platform.midishow, logo: "midi", privacy: "public" },
		{ name: t.platform.linkedin, logo: "linkedin", privacy: "public" },
		{ name: t.platform.facebook, logo: "facebook", privacy: "public" },
		{ name: t.platform.instagram, logo: "instagram", privacy: "public" },
		{ name: t.platform.tiktok, logo: "tiktok", privacy: "public" },
		{ name: t.platform.pixiv, logo: "pixiv", privacy: "public" },
		{ name: t.platform.github, logo: "github", privacy: "public" },
		// { name: "电话号码", icon: "phone", privacy: "private" },
	]);

	const enableCookie = computed({
		get: () => true,
		set: value => !value && useToast(t.toast.failed_to_disable_cookies, "error"),
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
	<div>
		<InfoBar type="warning" title="警告">
			该页面中的某些功能正在开发中，无法按预期工作。
		<!-- TODO: 使用多语言 -->
		</InfoBar>

		<!-- TODO: 使用多语言 -->
		<Subheader icon="cookie">网络曲奇☆</Subheader>
		<section list>
			<ToggleSwitch v-model="enableCookie" v-ripple icon="cookie">{{ t.privacy.allow_cookies }}</ToggleSwitch>
		</section>

		<div class="privacy-header">
			<Subheader icon="visibility">{{ t.privacy.info_visibility }}</Subheader>
			<div class="options">
				<SoftButton v-tooltip:top="t.privacy.public" icon="visibility" @click="setColonVisibility('public')" />
				<SoftButton v-tooltip:top="t.privacy.following" icon="person_add" @click="setColonVisibility('following')" />
				<SoftButton v-tooltip:top="t.privacy.private" icon="visibility_off" @click="setColonVisibility('private')" />
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

		<div class="submit">
			<Button icon="reset" class="secondary">{{ t.step.reset }}</Button>
			<Button icon="check" @click="useToast(t.toast.modification_failed, 'error');">{{ t.step.apply }}</Button>
		</div>
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
		gap: 8px;
		justify-content: flex-end;
		margin-right: 10px;
	}
</style>

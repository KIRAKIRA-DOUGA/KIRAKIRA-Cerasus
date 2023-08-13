<script setup lang="ts">
	const visibilities = reactive < { name: string; icon?: string; logo?: string; privacy: PrivacyType }[]>([
		{ name: "生日", icon: "birthday", privacy: "public" },
		{ name: "关注", icon: "person_add", privacy: "public" },
		{ name: "粉丝", icon: "person_heart", privacy: "public" },
		{ name: "收藏", icon: "star", privacy: "public" },
		{ name: "Twitter", logo: "twitter", privacy: "public" },
		{ name: "QQ", logo: "qq", privacy: "public" },
		{ name: "哔哩哔哩", logo: "bilibili", privacy: "public" },
		{ name: "ニコニコ", logo: "niconico", privacy: "public" },
		{ name: "YouTube", logo: "youtube", privacy: "public" },
		{ name: "音MAD维基", logo: "otomadwiki", privacy: "public" },
		{ name: "微博", logo: "weibo", privacy: "public" },
		{ name: "Discord", logo: "discord", privacy: "public" },
		{ name: "Telegram", logo: "telegram", privacy: "public" },
		{ name: "MidiShow", logo: "midi", privacy: "public" },
		{ name: "电话号码", icon: "phone", privacy: "private" },
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
	<Subheader icon="cookie">网络曲奇☆</Subheader>
	<section list>
		<ToggleSwitch v-ripple on icon="cookie">允许网站使用Cookie</ToggleSwitch>
	</section>

	<div class="privacy-header">
		<Subheader icon="visibility">个人信息可见性</Subheader>
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
		<Button icon="reset" :style="{ '--appearance': 'secondary' }">{{ t.reset }}</Button>
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

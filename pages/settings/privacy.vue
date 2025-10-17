<script setup lang="ts">
	const { t } = useI18n();

	const enableCookie = computed({
		get: () => true,
		set: value => !value && useToast(t("toast.failed_to_disable_cookies"), "error"),
	});

	const isApplyingVisibilitiesSetting = ref(false);
	const isReactVisibilitiesSetting = ref(false);
	const isFetchingVisibilitiesSetting = ref(false);
	const isPending = computed(() => isApplyingVisibilitiesSetting.value || isReactVisibilitiesSetting.value || isFetchingVisibilitiesSetting.value);

	const privaryVisibilities = ref<UserPrivaryVisibilitiesSettingDto[]>([]); // 用户隐私信息可视性数据。
	const linkedAccountVisibilities = ref<UserLinkedAccountsVisibilitiesSettingDto[]>([]); // 用户关联平台可视性数据。

	const PRIVARY_VISIBILITIES_SETTING_ITEMS = [
		{ id: "privary.birthday", name: t("user.birthday"), icon: "birthday" },
		{ id: "privary.age", name: t("user.age"), icon: "calendar" },
		{ id: "privary.follow", name: t("following"), icon: "person_add" },
		{ id: "privary.fans", name: t("follower", 2), icon: "person_heart" },
		{ id: "privary.favorites", name: t("collection.title", 2), icon: "star" },
	];

	/**
	 * 获取某一项隐私的可见性设置。
	 * @param privaryId - 隐私项名称。
	 * @returns 用户对该隐私项的可见性设置。
	 */
	function getPrivaryVisibilitiesSetting(privaryId: string): PrivacyType {
		const filtedPrivaryVisibilities = privaryVisibilities.value.filter(privaryVisibilitie => privaryVisibilitie.privaryId === privaryId);
		if (filtedPrivaryVisibilities.length === 1)
			return filtedPrivaryVisibilities[0].visibilitiesType;
		else
			return "public";
	}

	/**
	 * 更新 privaryVisibilities 的方法。
	 * 如果新的设置在 privaryVisibilities 中存在，则更新对应项，如果不存在，则追加。
	 * @param visibilitieSetting - 新的隐私设置。
	 */
	function updatePrivaryVisibilities(visibilitieSetting: { id: string; visibilitiesType: PrivacyType }) {
		// 找到 privaryVisibilities 中与传入的 visibilitieSetting 的 privaryId 相同的项
		const index = privaryVisibilities.value.findIndex(item => item.privaryId === visibilitieSetting.id);

		if (index !== -1) // 如果存在，更新对应项
			privaryVisibilities.value[index] = { ...visibilitieSetting, privaryId: visibilitieSetting.id };
		else // 如果不存在，追加新项
			privaryVisibilities.value.push({ ...visibilitieSetting, privaryId: visibilitieSetting.id });
	}

	/**
	 * 快速设置个人信息隐私列的可见性。
	 * @param privacy - 隐私可见性。
	 */
	function setColonPrivacyVisibility(privacy: PrivacyType) {
		privaryVisibilities.value = PRIVARY_VISIBILITIES_SETTING_ITEMS.map(item => { return { privaryId: item.id, visibilitiesType: privacy }; });
	}

	/**
	 * 快速重置所有隐私项设置
	 * 重置为保存前的状态
	 */
	async function resetColonVisibility() {
		isReactVisibilitiesSetting.value = true;
		await getVisibilitiesSettings();
		isReactVisibilitiesSetting.value = false;
	}

	/**
	 * 应用用户当前隐私可见性设置。
	 */
	async function applyVisibilitiesSetting() {
		isApplyingVisibilitiesSetting.value = true;
		try {
			const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
				userPrivaryVisibilitiesSetting: privaryVisibilities.value,
				userLinkedAccountsVisibilitiesSetting: linkedAccountVisibilities.value,
			};
			const updateUserSettingsResult = await api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
			if (updateUserSettingsResult.success)
				useToast(t("toast.settings_updated"), "success");
			else
				useToast(t("toast.something_went_wrong"), "error", 5000);
		} catch (error) {
			useToast(t("toast.something_went_wrong"), "error", 5000);
			console.error("ERROR", "更新用户隐私设置时出错：", error);
		}
		isApplyingVisibilitiesSetting.value = false;
	}

	/**
	 * 获取用户的隐私可见性设置
	 */
	async function getVisibilitiesSettings() {
		isFetchingVisibilitiesSetting.value = true;
		try {
			const headerCookie = useRequestHeaders(["cookie"]);
			const userSettings = await api.user.getUserSettings({ headerCookie });
			if (userSettings.success) {
				privaryVisibilities.value = userSettings.userSettings?.userPrivaryVisibilitiesSetting ?? [];
				linkedAccountVisibilities.value = userSettings.userSettings?.userLinkedAccountsVisibilitiesSetting ?? [];
			}
		} catch (error) {
			useToast(t("toast.something_went_wrong"), "error", 5000);
			console.error("ERROR", "获取用户设置时出错出错：", error);
		}
		isFetchingVisibilitiesSetting.value = false;
	}

	await getVisibilitiesSettings();
</script>

<template>
	<div>
		<InfoBar type="warning" :title="$t('severity.warning')">
			{{ $t("under_construction.page") }}
		</InfoBar>

		<Subheader icon="cookie">{{ $t("privacy.cookie") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="enableCookie" v-ripple icon="cookie">{{ $t("privacy.allow_cookies") }}</ToggleSwitch>
		</section>

		<div class="privacy-header">
			<Subheader icon="visibility">{{ $t("privacy.info_visibility") }}</Subheader>
			<div class="options">
				<SoftButton v-tooltip:top="$t('privacy.public')" icon="visibility" @click="setColonPrivacyVisibility('public')" />
				<SoftButton v-tooltip:top="$t('privacy.following')" icon="person_add" @click="setColonPrivacyVisibility('following')" />
				<SoftButton v-tooltip:top="$t('privacy.private')" icon="visibility_off" @click="setColonPrivacyVisibility('private')" />
			</div>
		</div>
		<section list>
			<SettingsPrivacyItem
				v-for="item in PRIVARY_VISIBILITIES_SETTING_ITEMS"
				:key="item.name"
				:modelValue="{ id: item.id, visibilitiesType: getPrivaryVisibilitiesSetting(item.id) }"
				@update:modelValue="$event => updatePrivaryVisibilities($event)"
				:icon="item.icon || 'placeholder'"
			>{{ item.name }}</SettingsPrivacyItem>
		</section>

		<div class="submit">
			<Button icon="reset" :disabled="isPending" :loading="isReactVisibilitiesSetting" class="secondary" @click="resetColonVisibility()">{{ $t("step.reset") }}</Button>
			<Button icon="check" :disabled="isPending" :loading="isApplyingVisibilitiesSetting" @click="applyVisibilitiesSetting">{{ $t("step.apply") }}</Button>
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

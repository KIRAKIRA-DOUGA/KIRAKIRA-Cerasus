<script setup lang="ts">
	const dataSaverMode = ref("standard");
	const focusMode = reactive({
		noSearchRecommendations: false,
		noRelatedVideos: false,
		noRecentSearch: false,
		noViewHistory: false,
	});

	const appSettings = useAppSettingsStore();
</script>

<template>
	<div>
		<InfoBar type="warning" :title="$t('severity.warning')">
			{{ $t("under_construction.page") }}
			<ol>
				<li>可用功能：「{{ $t("preference.new_window.open_video_in_new_tab") }}」、「{{ $t("preference.relative_date") }}」和「{{ $t("search") }}」组中的设置。</li>
				<li>除上述功能外其它功能都用不了。</li>
				<li>本页面缺乏国际化。</li>
			</ol>
		</InfoBar>
		<!-- NOTE: 缺少多语言，但该功能似乎并非容易实现，如不能实现可删除该功能。 -->
		<Subheader icon="placeholder">流量节省程序模式</Subheader>
		<section list>
			<RadioButton v-model="dataSaverMode" v-ripple value="economical" details="不会显示图片，不会自动加载视频。">省流模式</RadioButton>
			<RadioButton v-model="dataSaverMode" v-ripple value="standard">标准模式</RadioButton>
			<RadioButton v-model="dataSaverMode" v-ripple value="consumption" details="将一次性加载大量图片，提前加载靠后几页的评论。以防网络突然中断。">极速模式</RadioButton>
		</section>

		<Subheader icon="placeholder">{{ $t("preference.focus_mode.title") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="focusMode.noSearchRecommendations" v-ripple value="noSearchRecommendations" icon="placeholder">{{ $t("preference.focus_mode.no_search_recommendations") }}</ToggleSwitch>
			<ToggleSwitch v-model="focusMode.noRelatedVideos" v-ripple value="noRelatedVideos" icon="placeholder">{{ $t("preference.focus_mode.no_related_videos") }}</ToggleSwitch>
		</section>

		<Subheader icon="shield">{{ $t("privacy.title") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="focusMode.noRecentSearch" v-ripple value="noRecentSearch" icon="placeholder">{{ $t("preference.focus_mode.no_recent_search") }}</ToggleSwitch>
			<ToggleSwitch v-model="focusMode.noViewHistory" v-ripple value="noViewHistory" icon="placeholder">{{ $t("preference.focus_mode.no_view_history") }}</ToggleSwitch>
		</section>

		<Subheader icon="placeholder">{{ $t("preference.new_window.title") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="appSettings.isOpenVideoInNewTab" v-ripple icon="placeholder">{{ $t("preference.new_window.open_video_in_new_tab") }}</ToggleSwitch>
		</section>

		<Subheader icon="placeholder">{{ $t("preference.misc") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="appSettings.relativeDate" v-ripple icon="time">{{ $t("preference.relative_date") }}</ToggleSwitch>
		</section>

		<Subheader icon="search">{{ $t("search") }}</Subheader>
		<section list>
			<ToggleSwitch v-model="appSettings.search.isDynamicUrl" v-ripple icon="link">{{ $t("preference.search.dynamic_url") }}</ToggleSwitch>
			<ToggleSwitch v-model="appSettings.search.isApplyUrlSearchCriteria" v-ripple icon="search">
				<Preserves>{{ $t("preference.search.apply_url_search_criteria") }}</Preserves>
			</ToggleSwitch>
		</section>
	</div>
</template>

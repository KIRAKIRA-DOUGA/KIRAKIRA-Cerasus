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
		<!-- WARN: 使用多语言，该页面严重缺乏国际化 -->
		<!-- TODO: 使用多语言 -->
		<InfoBar type="warning" :title="$t('severity.warning')">
			{{ $t('under_construction.page') }}
			<ol>
				<li>可用功能：在新窗口打开视频、同步外观样式、使用阿卡林游客头像、使用相对时间。</li>
				<li>除上述功能外其它功能都用不了。</li>
				<li>本页面缺乏国际化。</li>
			</ol>
			<!-- TODO: 使用多语言 -->
		</InfoBar>
		<Subheader icon="placeholder">流量节省程序模式</Subheader>
		<!-- 该功能似乎并容易实现，如不能实现可删除该功能。 -->
		<section list>
			<RadioButton v-model="dataSaverMode" v-ripple value="economical" details="不会显示图片，不会自动加载视频。">省流模式</RadioButton>
			<RadioButton v-model="dataSaverMode" v-ripple value="standard">标准模式</RadioButton>
			<RadioButton v-model="dataSaverMode" v-ripple value="consumption" details="将一次性加载大量图片，提前加载靠后几页的评论。以防网络突然中断。">极速模式</RadioButton>
		</section>

		<Subheader icon="placeholder">专注模式</Subheader>
		<section list>
			<ToggleSwitch v-model="focusMode.noSearchRecommendations" v-ripple value="noSearchRecommendations" icon="placeholder">禁用搜索推荐</ToggleSwitch>
			<ToggleSwitch v-model="focusMode.noRelatedVideos" v-ripple value="noRelatedVideos" icon="placeholder">禁用相关视频</ToggleSwitch>
		</section>

		<Subheader icon="shield">隐私</Subheader>
		<section list>
			<ToggleSwitch v-model="focusMode.noRecentSearch" v-ripple value="noRecentSearch" icon="placeholder">停止显示搜索历史</ToggleSwitch>
			<ToggleSwitch v-model="focusMode.noViewHistory" v-ripple value="noViewHistory" icon="placeholder">停用历史记录</ToggleSwitch>
		</section>

		<Subheader icon="placeholder">新窗口</Subheader>
		<section list>
			<ToggleSwitch v-model="appSettings.isOpenVideoInNewTab" icon="placeholder">在新标签页打开视频</ToggleSwitch>
		</section>

		<Subheader icon="placeholder">？？？</Subheader>
		<section list>
			<ToggleSwitch v-model="appSettings.relativeDate" icon="time">使用相对时间</ToggleSwitch>
		</section>
	</div>
</template>

<script setup lang="ts">
	import aira from "assets/images/aira.jpg";
	const nuxt = useNuxtApp();

	const repositories: { name: string; codeName?: string; link: string; icon?: string }[] = [
		{ name: "GitHub前端仓库地址与问题反馈", codeName: "Cerasus", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus" },
		{ name: "个人中心Markdown仓库地址与问题反馈", codeName: "KIRAKIRA Flavored Markdown", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Flavored-Markdown" },
		{ name: "GitHub后端仓库地址与问题反馈", codeName: "Rosales", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Rosales" },
	];

	const team: { name: string; job: string; uid: number; avatar?: string }[] = [
		{ name: "艾了个拉", job: "站娘", uid: 2, avatar: aira },
		{ name: "冲锋的小卡卡", job: "全栈", uid: 10 },
		{ name: "派完", job: "全栈", uid: 8 },
		{ name: "琪露诺瓦露", job: "前端", uid: 9 },
		{ name: "兰音", job: "前端", uid: 6 },
		{ name: "维他柠檬茶", job: "前端", uid: NaN },
		{ name: "鸣", job: "前端", uid: NaN },
		{ name: "纾浚", job: "前端", uid: NaN },
		{ name: "冰鸠樱乃", job: "前端", uid: 7 },
		{ name: "心水湛清", job: "后端", uid: NaN },
		{ name: "韩琦", job: "后端", uid: NaN },
		{ name: "正卯", job: "后端", uid: NaN },
		{ name: "闹钟酱", job: "运维", uid: NaN },
		// 打不出中文名和未知职位的先不打。
	];

	const technologies: { name: string; version: string; ability: string; icon?: string; link: string }[] = [
		{ name: "Nuxt", version: nuxt.versions.nuxt || "3", ability: "服务端渲染框架", link: "https://nuxt.com/" },
		{ name: "Vue", version: nuxt.versions.vue || "3", ability: "渐进式前端框架", link: "https://vuejs.org/" },
		{ name: "TypeScript", version: "5", ability: "静态类型检查器", link: "https://www.typescriptlang.org/" },
		{ name: "Node.js", version: "20", ability: "服务端开发平台", link: "https://nodejs.org/" },
		{ name: "Koa", version: "3", ability: "下一代网络框架", link: "https://koajs.com/" },
		// 基于前端运行时的版本号可以自动识别，后端和编译时的版本号只能委屈你自己手打了。
	];
</script>

<template>
	<LogoText form="full" />
	<p class="slogan">一个可爱的视频网站，<b>献给可爱的你！</b></p>
	<Subheader icon="placeholder">项目地址</Subheader>
	<div class="chip">
		<SettingsChipItem
			v-for="repo in repositories"
			:key="repo.name"
			:icon="repo.icon || 'placeholder'"
			:details="repo.codeName"
			:href="repo.link"
			afterIcon="open_in_new"
		>{{ repo.name }}</SettingsChipItem>
	</div>
	<Subheader icon="placeholder">创作团队</Subheader>
	<div class="chip">
		<SettingsChipItem
			v-for="staff in team"
			:key="staff.name"
			:image="staff.avatar"
			icon="placeholder"
			:details="`${staff.job} - UID ${staff.uid}`"
			afterIcon="open_in_new"
		>{{ staff.name }}</SettingsChipItem>
	</div>
	<Subheader icon="placeholder">使用技术</Subheader>
	<div class="chip">
		<SettingsChipItem
			v-for="tech in technologies"
			:key="tech.name"
			:icon="tech.icon || 'placeholder'"
			:details="`${tech.ability} - v${tech.version}`"
			:href="tech.link"
			afterIcon="open_in_new"
		>{{ tech.name }}</SettingsChipItem>
	</div>
</template>

<style scoped lang="scss">
	.logo-text {
		zoom: 2;
	}

	.slogan {
		color: c(accent);
		font-size: 20px;
	}
</style>

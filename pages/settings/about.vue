<script setup lang="ts">
	import aira from "assets/images/aira.jpg";
	import placeholder from "assets/icons/placeholder.svg";
	const nuxt = useNuxtApp();

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

	const technologies: { name: string; version: string; ability: string; icon?: string }[] = [
		{ name: "Nuxt", version: nuxt.versions.nuxt || "3", ability: "服务端渲染框架" },
		{ name: "Vue", version: nuxt.versions.vue || "3", ability: "渐进式前端框架" },
		{ name: "TypeScript", version: "5", ability: "静态类型检查器" },
		{ name: "Node.js", version: "20", ability: "服务端开发平台" },
		{ name: "Koa", version: "3", ability: "下一代网络框架" },
	];
	onMounted(() => {
		console.log(nuxt);
	});
</script>

<template>
	<LogoText form="full" />
	<p class="slogan">一个可爱的视频网站，<b>献给可爱的你！</b></p>
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

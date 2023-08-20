<script setup lang="ts">
	const avatar = (name: string) => {
		/* try {
			const avatars = import.meta.glob<typeof import("*.jpg")>("/assets/images/avatars/*", { eager: true });
			const result = avatars[`/assets/images/avatars/${name}`];
			return result.default;
		} catch (e) {
			return undefined;
		} */ // 以上代码为调用需打包的资源。
		return `/static/images/avatars/${name}`;
	};

	const nuxt = useNuxtApp();

	const repositories: { name: string; codeName?: string; link: string; icon?: string }[] = [
		{ name: "GitHub前端仓库地址与问题反馈", codeName: "KIRAKIRA Cerasus", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus" },
		{ name: "个人中心Markdown仓库地址与问题反馈", codeName: "KIRAKIRA Flavored Markdown", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Flavored-Markdown" },
		{ name: "GitHub后端仓库地址与问题反馈", codeName: "KIRAKIRA Golang Backend", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-golang-backend" },
		// { name: "GitHub后端仓库地址与问题反馈", codeName: "KIRAKIRA Rosales", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Rosales" },
	];

	const team: { name: string; job: string[]; uid: number; avatar?: string }[] = [
		{ name: "艾了个拉", job: [t.settings.about.staff.webmistress, t.settings.about.staff.designer], uid: NaN, avatar: avatar("aira.webp") },
		{ name: "兰音", job: [t.settings.about.staff.frontend, t.settings.about.staff.designer], uid: NaN, avatar: avatar("nucleic_acid_testing.jpg") },
		{ name: "OtoMAN", job: [t.settings.about.staff.backend], uid: NaN, avatar: avatar("Otoman.png") },
		{ name: "冲锋的小卡卡", job: [t.settings.about.staff.backend], uid: NaN, avatar: avatar("ZERO_TWO.jpg") },
		{ name: "维他柠檬茶", job: [t.settings.about.staff.frontend], uid: NaN, avatar: avatar("VTchara.webp") },
		{ name: "琪露诺瓦露", job: [t.ja, t.settings.about.staff.translator], uid: NaN, avatar: avatar("Cirnoire.png") },
		{ name: "Sidd", job: [t.settings.about.staff.frontend], uid: NaN, avatar: avatar("sidd.jpg") },
		{ name: "鸣", job: [t.settings.about.staff.frontend], uid: NaN, avatar: avatar("Mingeax.jpg") },
	];

	const technologies: { name: string; version: string; ability: string; icon?: string; monochrome?: boolean; link: string }[] = [
		{ name: "Nuxt", version: nuxt.versions.nuxt || "3", ability: "服务端渲染框架", icon: "nuxt", link: "https://nuxt.com/" },
		{ name: "Vue", version: nuxt.versions.vue || "3", ability: "渐进式前端框架", icon: "vue", link: "https://vuejs.org/" },
		{ name: "TypeScript", version: "5", ability: "静态类型检查器", icon: "typescript", link: "https://www.typescriptlang.org/" },
		{ name: "Node.js", version: "18", ability: "服务端开发平台", icon: "nodejs", link: "https://nodejs.org/" },
		// { name: "Koa", version: "3", ability: "服务端网络框架", icon: "koa", monochrome: true, link: "https://koajs.com/" },
		{ name: "Go", version: "1.20", ability: "服务端编程语言", icon: "go", link: "https://go.dev/" },
		// 基于前端运行时的版本号可以自动识别，后端和编译时的版本号只能委屈你自己手打了。
	];
</script>

<template>
	<LogoText />
	<p class="slogan"><span>一个可爱的视频网站，</span><span><b>献给可爱的你！</b></span></p>

	<Subheader icon="link">{{ t.settings.about.repositories }}</Subheader>
	<section>
		<SettingsChipItem
			v-for="repo in repositories"
			:key="repo.name"
			:icon="repo.icon || 'mono-logo/github'"
			:details="repo.codeName"
			:href="repo.link"
			trailingIcon="open_in_new"
		>{{ repo.name }}</SettingsChipItem>
	</section>

	<Subheader icon="people">{{ t.settings.about.creative_team }}</Subheader>
	<section>
		<SettingsChipItem
			v-for="staff in team"
			:key="staff.name"
			:image="staff.avatar"
			icon="placeholder"
			:details="`${staff.job.join(' ')} - UID ${staff.uid}`"
			trailingIcon="open_in_new"
		>{{ staff.name }}</SettingsChipItem>
	</section>

	<Subheader icon="build">{{ t.settings.about.technologies_used }}</Subheader>
	<section>
		<SettingsChipItem
			v-for="tech in technologies"
			:key="tech.name"
			:icon="tech.icon ? 'colored-logo/' + tech.icon : 'placeholder'"
			:filled="!tech.monochrome"
			:details="`${tech.ability} - v${tech.version}`"
			:href="tech.link"
			trailingIcon="open_in_new"
		>{{ tech.name }}</SettingsChipItem>
	</section>
</template>

<style scoped lang="scss">
	.logo-text {
		--form: full;
		zoom: 2;

		@include mobile {
			--form: half;
		}
	}

	.slogan {
		color: c(accent);
		font-size: 20px;

		span {
			display: inline-block;
		}
	}
</style>

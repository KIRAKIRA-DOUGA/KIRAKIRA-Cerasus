<script setup lang="ts">
	const avatar = (name: string) => `/static/images/avatars/${name}`;

	const nuxt = useNuxtApp();

	const repositories: { name: string; codeName?: string; link: string; icon?: string }[] = [
		{ name: t.about.repositories.frontend, codeName: "KIRAKIRA Cerasus", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus" },
		{ name: t.about.repositories.markdown, codeName: "KIRAKIRA Flavored Markdown", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Flavored-Markdown" },
		{ name: t.about.repositories.backend, codeName: "KIRAKIRA Rosales", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Rosales" },
	];

	const team: { name: string; job: string[]; uid: number; avatar?: string }[] = [
		{ name: "艾了个拉", job: [t.about.staff.webmistress, t.about.staff.designer], uid: NaN, avatar: avatar("aira.webp") },
		{ name: "兰音", job: [t.about.staff.frontend, t.about.staff.designer], uid: NaN, avatar: avatar("nucleic_acid_testing.jpg") },
		{ name: "维他柠檬茶", job: [t.about.staff.frontend], uid: NaN, avatar: avatar("VTchara.webp") },
		{ name: "鸣", job: [t.about.staff.frontend], uid: NaN, avatar: avatar("Mingeax.jpg") },
		{ name: "冲锋的小卡卡", job: [t.about.staff.backend], uid: NaN, avatar: avatar("ZERO_TWO.jpg") },
		{ name: "琪露诺瓦露", job: [t.about.staff.translator(t.language.ja)], uid: NaN, avatar: avatar("Cirnoire.png") },
		{ name: "韩琦Mica", job: [t.about.staff.translator(t.language.zht)], uid: NaN, avatar: avatar("HanceyMica.png") },
		{ name: "Cyahega", job: [t.about.staff.translator(t.language.vi)], uid: NaN, avatar: avatar("Cyahega.jpg") },
		{ name: "Remagtacrepus", job: [t.about.staff.translator(t.language.vi)], uid: NaN, avatar: avatar("remagtacrepus.png") },
		{ name: "Ade Edogawa", job: [t.about.staff.translator(t.language.id)], uid: NaN, avatar: avatar("AdeEdogawa.jpg") },
		{ name: "Jujun Gamers", job: [t.about.staff.translator(t.language.id)], uid: NaN, avatar: avatar("JujunG.webp") },
	];

	const technologies: { name: string; version?: string; ability: string; icon?: string; monochrome?: boolean; link: string }[] = [
		{ name: "Nuxt", version: nuxt.versions.nuxt || "3", ability: "Vue Framework for Frontend", icon: "nuxt", link: "https://nuxt.com/" },
		{ name: "Vue", version: nuxt.versions.vue || "3", ability: "Progressive Framework for Frontend", icon: "vue", link: "https://vuejs.org/" },
		{ name: "Koa", version: "3", ability: "Web Framework for Backend", icon: "koa", monochrome: true, link: "https://koajs.com/" },
		{ name: "Node.js", version: "20", ability: "JavaScript Runtime Environment", icon: "nodejs", link: "https://nodejs.org/" },
		{ name: "TypeScript", version: "5", ability: "JavaScript with Syntax for Types", icon: "typescript", link: "https://www.typescriptlang.org/" },
		{ name: "Vercel", ability: "Website Hosting Services", icon: "vercel", monochrome: true, link: "https://vercel.com/" },
		// 基于前端运行时的版本号可以自动识别，后端和编译时的版本号只能委屈你自己手打了。
	];

	const sloganLines = computed(() => t.about.slogan.toString().split("\n"));
	const remainingClick = ref(4);

	/**
	 * 连续点击五次 LOGO 即可进入开发者模式或显示彩蛋。
	 * @param e - 鼠标事件。
	 */
	function showDevMode(e: MouseEvent) {
		replayAnimation(e.currentTarget as HTMLDivElement, "active");
		if (remainingClick.value) {
			clearAllToast();
			useToast(`继续点击${remainingClick.value--}次即可进入开发者模式`, "info");
			return;
		}
		clearAllToast();
		useToast("你已进入开发者模式！", "success");
	}
</script>

<template>
	<Fragment>
		<div class="info" @click="showDevMode">
			<LogoText />
			<p class="slogan"><span>{{ sloganLines[0] }}</span><span><b>{{ sloganLines[1] }}</b></span></p>
		</div>
	</Fragment>

	<Subheader icon="link">{{ t.about.repositories }}</Subheader>
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

	<Subheader icon="people">{{ t.about.team }}</Subheader>
	<section>
		<SettingsChipItem
			v-for="staff in team"
			:key="staff.name"
			:image="staff.avatar"
			icon="placeholder"
			:details="`${staff.job.join(' / ')} - UID ${staff.uid}`"
			trailingIcon="open_in_new"
		>{{ staff.name }}</SettingsChipItem>
	</section>

	<Subheader icon="build">{{ t.about.technologies_used }}</Subheader>
	<section>
		<SettingsChipItem
			v-for="tech in technologies"
			:key="tech.name"
			:icon="tech.icon ? 'colored-logo/' + tech.icon : 'placeholder'"
			:filled="!tech.monochrome"
			:details="tech.version ? `${tech.ability} - v${tech.version}` : tech.ability"
			:href="tech.link"
			trailingIcon="open_in_new"
		>{{ tech.name }}</SettingsChipItem>
	</section>
</template>

<style scoped lang="scss">
	.info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		margin: 3rem 0;
		animation: none;

		> * {
			animation: float-up 600ms $ease-out-smooth backwards;

			@for $i from 1 through 2 {
				&:nth-child(#{$i}) {
					animation-delay: 150ms * ($i - 1);
				}
			}
		}

		&.active {
			animation: swing 500ms $ease-out-sine;
		}
	}

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
		text-align: center;

		span {
			display: inline-block;
		}
	}

	@keyframes float-up {
		from {
			opacity: 0;
			translate: 0 1rem;
		}
	}
</style>

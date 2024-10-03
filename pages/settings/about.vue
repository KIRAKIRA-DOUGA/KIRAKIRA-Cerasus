<script setup lang="ts">
	const nuxt = useNuxtApp();
	const isDevMode = inject<Ref<boolean>>("isDevMode");

	const { gitBranch, gitCommit } = useRuntimeConfig().public;

	const repositories: { name: string; codeName?: string; link: string; icon?: string }[] = [
		{ name: t.about.repositories.frontend, codeName: "KIRAKIRA Cerasus", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Cerasus" },
		{ name: t.about.repositories.backend, codeName: "KIRAKIRA Rosales", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Rosales" },
		{ name: t.about.repositories.markdown, codeName: "KIRAKIRA Flavored Markdown", link: "https://github.com/KIRAKIRA-DOUGA/KIRAKIRA-Flavored-Markdown" },
	];

	const team = reactive<{ nickname?: string; username?: string; job: string[]; uid: number; avatar?: string }[]>([
		{ uid: 1, job: [t.about.staff.webmistress, t.about.staff.designer] },
		{ uid: 3, job: [t.about.staff.frontend, t.about.staff.designer] },
		{ uid: 12, job: [t.about.staff.frontend] },
		{ uid: 5, job: [t.about.staff.designer] },
		// { uid: NaN, name: "鸣", job: [t.about.staff.frontend] },
		{ uid: 2, job: [t.about.staff.backend] },
		{ uid: 9, job: [t.about.staff.translator(t.language.ja)] },
		{ uid: 4, job: [t.about.staff.translator(t.language.zht)] },
		// { uid: NaN, name: "HanceyMica", job: [t.about.staff.translator(t.language.zht)] },
		{ uid: 8, job: [t.about.staff.translator(t.language.vi)] },
		{ uid: 7, job: [t.about.staff.translator(t.language.vi)] },
		{ uid: 209, job: [t.about.staff.translator(t.language.yue)] },
	]);

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
		if (remainingClick.value && !isDevMode?.value) {
			clearAllToast();
			useToast(`继续点击${remainingClick.value--}次即可进入开发者模式`, "info");
			return;
		}
		clearAllToast();
		useToast("你已进入开发者模式！", "success");
		isDevMode && (isDevMode.value = true);
	}

	team.forEach(async developer => {
		const { uid } = developer;
		if (!Number.isFinite(uid)) return;
		const userInfo = await api.user.getUserInfo({ uid });
		if (userInfo.success) {
			developer.nickname = userInfo.result?.userNickname;
			developer.username = userInfo.result?.username;
			developer.avatar = userInfo.result?.avatar;
		}
	});
</script>

<template>
	<div>
		<Contents>
			<div class="info">
				<div class="product" @click="showDevMode">
					<LogoText />
					<p class="slogan"><span>{{ sloganLines[0] }}</span><span><b>{{ sloganLines[1] }}</b></span></p>
				</div>
				<div class="version">
					<template v-if="gitBranch && gitCommit">
						<div>
							<Icon name="branch" /><span>{{ gitBranch }}</span>
						</div>
						<div>
							<Icon name="commit" /><span>{{ gitCommit.slice(0, 7) }}</span>
						</div>
					</template>
					<template v-else>
						<div>
							<Icon name="code" /><span>Frontend Development Mode</span>
						</div>
						<div v-if="environment.localBackend">
							<Icon name="server" /><span>Local Backend</span>
						</div>
					</template>
				</div>
			</div>
		</Contents>

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
				:key="staff.username"
				:image="staff.avatar"
				icon="account_circle"
				:details="`${staff.job.join(' / ')} - UID ${staff.uid}`"
				trailingIcon="open_in_new"
				:href="`/user/${staff.uid}`"
			>
				<span class="nickname">{{ staff.nickname }}</span>
				<span class="username">@{{ staff.username }}</span>
			</SettingsChipItem>
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
	</div>
</template>

<style scoped lang="scss">
	.info {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
		margin: 3rem 0;
		animation: none;
	}

	.product {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;

		> * {
			animation: float-up 800ms $ease-out-smooth backwards;

			@for $i from 1 through 2 {
				&:nth-child(#{$i}) {
					animation-delay: 100ms * ($i - 1);
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

	.version {
		@include round-small;
		display: flex;
		gap: 16px;
		justify-content: center;
		align-items: center;
		padding: 8px 16px;
		color: c(accent);
		background-color: c(accent-hover-overlay);
		animation: float-up 800ms 200ms $ease-out-smooth backwards;

		> div {
			display: flex;
			gap: 4px;
			align-items: center;

			> .icon {
				font-size: 16px;
			}

			> span {
				font-size: 13px;
				user-select: text;
			}
		}
	}

	.nickname {
		font-weight: bold;
	}

	.username {
		margin-left: 0.5em;
		color: c(icon-color);
	}

	@keyframes float-up {
		from {
			translate: 0 5rem;
			opacity: 0;
		}
	}
</style>

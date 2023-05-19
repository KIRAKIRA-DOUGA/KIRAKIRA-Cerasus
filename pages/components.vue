<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	import animationData from "lotties/spinner-dev1.json";
	import { LogoTextFormType } from "components/Logo/LogoText.vue";
	import beepSrc from "assets/audios/NOVA 2022.1 Alert Quick.ogg";
	import Menu from "components/Menu/Menu.vue";
	import { CheckState } from "components/Checkbox.vue";
	import { ToastEvent } from "composables/toast";

	const page = ref(1);
	const pages = ref(99);
	const opPage = ref(1);
	const op = ["你说得对,但是", ..."《原神》是由米哈游自主研发的一款全新开放世界冒险游戏。游戏发生在一个被称作「提瓦特」的幻想世界，在这里，被神选中的人将被授予「神之眼」，导引元素之力。你将扮演一位名为「旅行者」的神秘角色在自由的旅行中邂逅性格各异、能力独特的同伴们，和他们一起击败强敌，找回失散的亲人⸺同时，逐步发掘「原神」的真相。"];
	const displayPageCount = ref(7);
	const toggle = ref(false);
	const isClicked = ref(false);
	const theme = Theme.theme;
	const palette = Theme.palette;
	const { locale: currentLocale, locales } = useI18n();
	const localeModel = computed({
		get: () => currentLocale.value,
		set: value => switchLanguage(value),
	});
	const localeList = computed(() => (locales.value as LocaleObject[]).map(locale => ({
		code: locale.code,
		name: locale.name || locale.code,
	})));
	const timeoutId = ref<NodeJS.Timeout>();
	const isTagChecked = ref(false);
	const volume = ref(100);
	const pitch = ref(0);
	const selectedTab = ref("all");
	const logoTextForm = ref<LogoTextFormType>("full");
	const showAlert = ref(false);
	const showModal = ref(false);
	const showProgress = ref(true);
	const progressRingSize = ref(28);
	const progressRingThickness = ref(3);
	const progressBarHeight = ref(4);
	const inputValue = ref("");
	const isInvalid = computed(() => !inputValue.value.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/));
	const menu = ref<InstanceType<typeof Menu>>();
	const showMenu = () => menu.value?.show();
	const beep = ref<HTMLAudioElement>();
	const isUploaderLovinIt = ref(true);
	const kiraGoods = ref(["kawaii", "nijigen"]);
	const isSelectAll = computed<CheckState>(() => kiraGoods.value.length >= 3 ? "checked" : kiraGoods.value.length === 0 ? "unchecked" : "indeterminate");
	const onSelectAllChange = (e: { value: string; checkState: CheckState; checked: boolean }) => {
		kiraGoods.value = [];
		if (e.checked) kiraGoods.value.push("kawaii", "nijigen", "nice");
	};
	const toastMessage = ref("");
	const toastSeverity = ref<ToastEvent["severity"]>("success");

	/**
	 * 单击按钮事件。
	 * @param e - 鼠标事件。
	 */
	async function onClickButton(e: MouseEvent) {
		clearTimeout(timeoutId.value);
		const button = e.target as HTMLButtonElement;
		await animateSize(button, () => isClicked.value = true);
		await new Promise(resolve => timeoutId.value = setTimeout(resolve, 2000));
		await animateSize(button, () => isClicked.value = false);
	}

	/**
	 * 滑动滑动条完成后事件。
	 * @param _value - 滑动条数值。
	 */
	function onSlided(_value: number) {
		const b = beep.value;
		if (!b) return;
		b.currentTime = 0;
		b.play();
		b.preservesPitch = false;
		b.volume = (volume.value / 100) ** 2;
		b.playbackRate = 2 ** (pitch.value / 12);
	}

	useHead({ title: "组件测试页" });
</script>

<template>
	<div class="container">
		<div class="links">
			<LocaleLink to="/">{{ t.home }}</LocaleLink>
			<LocaleLink to="video">{{ t.video }}</LocaleLink>
			<LocaleLink to="/hello">{{ t.content }}</LocaleLink>
			<LocaleLink to="/search">{{ t.search }}</LocaleLink>
		</div>
		<div class="component-test">
			<PageController v-model="page" :pages="pages" :displayPageCount="displayPageCount" enableArrowKeyMove />
			<PageController v-model="opPage" :pages="op" :displayPageCount="15" enableArrowKeyMove />
			<Button class="test-button" @click="onClickButton">{{ isClicked ? t.buttonClicked : t.button }}</Button>
			<Button disabled>{{ t.buttonDisabled }}</Button>
			<Button @click="showConfetti">{{ t.confetti }}</Button>
			<!-- BUG: 所有 composable 的自动导入炸了，跟踪链接：https://github.com/nuxt/nuxt/issues/20827 -->
			<Button icon="send">{{ t.send }}</Button>
			<Button @click="showAlert = true">{{ t.showAlert }}</Button>
			<Button @click="showModal = true">显示模态框</Button>
			<Alert v-model="showAlert" static />
			<Modal v-model="showModal" title="标题栏">
				<div class="model-content">
					<div>
						<p>视频标题</p>
						<TextBox v-model="inputValue" placeholder="视频标题" />
					</div>
					<div>
						<p>视频分P</p>
						<TextBox v-model="inputValue" placeholder="视频分P" />
					</div>
				</div>
			</Modal>
			<ToggleSwitch v-model="toggle">{{ t.toggleSwitch }} {{ toggle ? t.on : t.off }}</ToggleSwitch>
			<ToggleSwitch disabled>{{ t.offDisabled }} </ToggleSwitch>
			<ToggleSwitch on disabled>{{ t.onDisabled }}</ToggleSwitch>
			<ToggleSwitch v-model="appConfig.showCssDoodle">{{ t.animatedBackground }}</ToggleSwitch>
			<RadioButton v-model="theme" value="light">{{ t.light }}</RadioButton>
			<RadioButton v-model="theme" value="dark">{{ t.dark }}</RadioButton>
			<RadioButton v-model="theme" value="system">{{ t.system }}</RadioButton>
			<hr />
			<RadioButton v-model="palette" value="pink">{{ t.pink }}</RadioButton>
			<RadioButton v-model="palette" value="sky">{{ t.sky }}</RadioButton>
			<RadioButton v-model="palette" value="blue">{{ t.blue }}</RadioButton>
			<RadioButton v-model="palette" value="orange">{{ t.orange }}</RadioButton>
			<RadioButton v-model="palette" value="purple">{{ t.purple }}</RadioButton>
			<RadioButton v-model="palette" value="green">{{ t.green }}</RadioButton>
			<RadioButton v-model="palette" value="custom" disabled>{{ t.custom }}</RadioButton>
			<RadioButton checked disabled>{{ t.onDisabled }}</RadioButton>
			<hr />
			<p>请问您喜欢KIRAKIRA的地方有：</p>
			<Checkbox :checkState="isSelectAll" @change="onSelectAllChange">全选</Checkbox>
			<Checkbox v-model="kiraGoods" value="kawaii">可爱</Checkbox>
			<Checkbox v-model="kiraGoods" value="nijigen">二次元</Checkbox>
			<Checkbox v-model="kiraGoods" value="nice">好康</Checkbox>
			<Checkbox disabled checkState="unchecked">鼠鼠我呀最讨厌了</Checkbox>
			<Checkbox disabled checkState="checked">欢迎白嫖</Checkbox>
			<hr />
			<TextBox v-model="inputValue" size="small" placeholder="小小的软软的香香的" />
			<TextBox v-model="inputValue" :invalid="isInvalid" placeholder="请输入正确的邮箱" />
			<TextBox v-model="inputValue" size="large" icon="lock" type="password" placeholder="密码" />
			<em>所有输入框的内容同时输入属正常现象，因为懒得做三个变量。</em>
			<hr />
			<RadioButton v-for="locale in localeList" :key="locale.code" v-model="localeModel" :value="locale.code" :lang="locale.code">{{ locale.name }}</RadioButton>
			<HeaderComments :count="233" />
			<hr />
			<Subheader>不确定加载条</Subheader>
			<ToggleSwitch v-model="showProgress">开启加载</ToggleSwitch>
			<p>大小</p><Slider v-model="progressRingSize" :min="1" :max="150" />
			<p>粗细</p><Slider v-model="progressRingThickness" :min="1" :max="60" />
			<p>高度</p><Slider v-model="progressBarHeight" :min="1" :max="100" />
			<ProgressRing :hidden="!showProgress" :style="{ '--size': progressRingSize + 'px', '--thickness': progressRingThickness + 'px' }" />
			<ProgressBar :hidden="!showProgress" :style="{ height: progressBarHeight + 'px' }" />
			<!-- <Lottie loop autoplay :animationData="animationData" /> -->
			<hr />
			<Tag v-model="isTagChecked">{{ t.tag }}</Tag>
			<br />
			<BlockText>你知道的<ruby>太<rt>tài</rt>多<rt>duō</rt></ruby>了。</BlockText>
			<BlockText color="var(--accent)">你知道的<ruby>太<rt>tài</rt>多<rt>duō</rt></ruby>了。</BlockText>
			<p>音量</p><Slider v-model="volume" :defaultValue="100" @changed="onSlided" />
			<p>音调</p><Slider v-model="pitch" :min="-24" :max="24" :defaultValue="0" @changed="onSlided" />
			<em>单击鼠标中键或触摸屏长按组件以还原默认值。</em>
			<audio ref="beep" :src="beepSrc"></audio>
			<TabBar v-model="selectedTab">
				<TabItem id="all">{{ t.all }}</TabItem>
				<TabItem id="video">{{ t.video }}</TabItem>
				<TabItem id="images">{{ t.images }}</TabItem>
				<TabItem id="long" badge="角标">测试很长很长很长</TabItem>
				<TabItem id="short">短</TabItem>
			</TabBar>
			<TabBar v-model="selectedTab" vertical>
				<TabItem id="all">{{ t.all }}</TabItem>
				<TabItem id="video">{{ t.video }}</TabItem>
				<TabItem id="images">{{ t.images }}</TabItem>
				<TabItem id="long" badge="角标">测试很长很长很长</TabItem>
				<TabItem id="short">短</TabItem>
			</TabBar>
			<hr />
			<div>
				<Button :style="{ marginBottom: '1rem' }" @click="showMenu">显示菜单</Button>
				<Menu ref="menu">
					<MenuItem icon="copy">复制</MenuItem>
					<MenuItem icon="cut">剪切</MenuItem>
					<MenuItem icon="paste">粘贴</MenuItem>
					<hr />
					<MenuItem icon="delete">删除</MenuItem>
				</Menu>
			</div>
			<div class="toast-test">
				<RadioButton v-model="toastSeverity" value="info">信息</RadioButton>
				<RadioButton v-model="toastSeverity" value="success">成功</RadioButton>
				<RadioButton v-model="toastSeverity" value="warning">警告</RadioButton>
				<RadioButton v-model="toastSeverity" value="error">错误</RadioButton>
				<section>
					<TextBox v-model="toastMessage" placeholder="发送消息到消息框" />
					<Button icon="send" @click="useToast(toastMessage, toastSeverity)">发送到消息框</Button>
				</section>
			</div>
			<RadioButton v-model="logoTextForm" value="hidden">{{ t.logoHidden }}</RadioButton>
			<RadioButton v-model="logoTextForm" value="half">{{ t.logoHalf }}</RadioButton>
			<RadioButton v-model="logoTextForm" value="full">{{ t.logoShow }}</RadioButton>
			<LogoText :form="logoTextForm" />
			<Accordion autoCollapse>
				<AccordionItem title="第1个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="第2个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="第3个">
					<h4>标题</h4>
					内容
				</AccordionItem>
				<AccordionItem title="➕❤️">
					<ToggleSwitch v-model="isUploaderLovinIt" :style="{ marginBottom: '0.75rem' }">➕❤️</ToggleSwitch>
					<UploaderAira :hidden="!isUploaderLovinIt" />
				</AccordionItem>
				<AccordionItem title="滚动条测试">
					<div class="scroll-test">
						<div class="scroll-test-item"></div>
					</div>
				</AccordionItem>
				<AccordionItem title="点击此处辣眼睛">
					<section class="marquee-section">
						<marquee>KiRAKiRA☆DOUGA</marquee>
						<marquee direction="up">让你的前端设计师气到脑中风</marquee>
						<marquee direction="down" width="250" height="200" behavior="alternate" class="marquee">
							<marquee behavior="alternate">DVD</marquee>
						</marquee>
					</section>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.component-test {
		> * {
			margin: 0.8rem 0.5rem;
		}
	}

	.links {
		display: flex;
		gap: 8px;
	}

	hr {
		border: none;
		border-top: c(divider, 10%) 1px solid;
	}

	.marquee {
		font-size: 3rem;
		font-style: italic;
		border: solid red;
	}

	.marquee-section {
		color: red;
		font-weight: 900;

		> :not(.marquee) {
			font-family: "Comic Sans MS", "华文彩云", fantasy;
		}
	}

	em {
		display: block;
	}

	.toast-test {
		> * {
			margin: 0.8rem 0;
		}

		> section {
			@include flex-center;
			gap: 10px;

			> button {
				flex-shrink: 0;
			}

			> .text-box {
				width: 100%;
			}
		}
	}

	.model-content {
		@include flex-block;
		gap: 16px;
		width: 400px;

		> * {
			@include flex-block;
			gap: 8px;
		}
	}

	.test-button :deep(*) {
		text-align: left;
	}

	.scroll-test {
		width: 100%;
		height: 500px;
		overflow: overlay;

		.scroll-test-item {
			@include square(200%);
		}
	}
</style>
